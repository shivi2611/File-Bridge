// WebRTC.js
const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "turn:turn.mozilla.org:3478", username: "webrtc", credential: "webrtc" }
  ],
};

let peerConnection = null;

const initializePeerConnection = () => {
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection(config);

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE Candidate generated:", event.candidate);
        // Send ICE candidate to the server if needed
      }
    };

    // Handle incoming data channels
    peerConnection.ondatachannel = (event) => {
      const dataChannel = event.channel;
      console.log("Data channel received:", dataChannel);

      dataChannel.binaryType = "arraybuffer";

      let receivedChunks = [];
      let fileMetadata = null;

      // Handle messages on the data channel
      dataChannel.onmessage = (e) => {
        if (typeof e.data === "string") {
          try {
            const message = JSON.parse(e.data);
            if (message.type === "metadata") {
              fileMetadata = message;
              console.log("Received file metadata:", fileMetadata);
            } else if (message.type === "end") {
              console.log("File transfer complete");
              
              const fullFile = new Blob(receivedChunks, { type: fileMetadata.mimeType });
              
              // Create a download link for the received file
              const downloadLink = document.createElement("a");
              downloadLink.href = URL.createObjectURL(fullFile);
              downloadLink.download = fileMetadata.name;
              downloadLink.click();
              
              URL.revokeObjectURL(downloadLink.href);

              // Reset for future transfers
              receivedChunks = [];
              fileMetadata = null;

              // Close the data channel

              if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
              }
            }
          } catch (e) {
            console.log("Non-JSON message received:", e.data);
          }
        } else {
          receivedChunks.push(e.data);
        }
      };
    };

    console.log("PeerConnection initialized.");
  }
};

const createWebRTCOffer = async (file) => {
  try {
    initializePeerConnection();

    const dataChannel = peerConnection.createDataChannel("fileTransfer");
    dataChannel.binaryType = "arraybuffer";

    // Handle data channel open event
    dataChannel.onopen = () => {
      console.log("Data channel is open and ready to send data");

      // Send file metadata first
      const metadata = {
        type: "metadata",
        name: file.name,
        size: file.size,
        mimeType: file.type,
      };
      dataChannel.send(JSON.stringify(metadata));

      const chunkSize = 16384; // Chunk size for splitting the file
      const fileReader = new FileReader();
      let offset = 0;

      // Read and send file chunks
      const sendNextChunk = () => {
        const chunk = file.slice(offset, offset + chunkSize);
        fileReader.readAsArrayBuffer(chunk);
      };

      fileReader.onload = () => {
        dataChannel.send(fileReader.result);
        console.log("Sent chunk:", offset);

        offset += fileReader.result.byteLength;
        if (offset < file.size) {
          sendNextChunk();
        } else {
          console.log("File transfer complete");
          dataChannel.send(JSON.stringify({ type: "end" }));
        }
      };

      sendNextChunk();
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log("WebRTC offer created:", offer);
    return offer;
  } catch (error) {
    console.error("Error creating WebRTC offer:", error);
    throw error;
  }
};

const createWebRTCAnswer = async (offer) => {
  try {
    initializePeerConnection();

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    console.log("WebRTC answer created:", answer);
    return answer;
  } catch (error) {
    console.error("Error creating WebRTC answer:", error);
    throw error;
  }
};

const setRemoteDescription = async (description) => {
  try {
    if (!peerConnection) initializePeerConnection();
    await peerConnection.setRemoteDescription(new RTCSessionDescription(description));
    console.log("Remote description set.");
  } catch (error) {
    console.error("Error setting remote description:", error);
  }
};

export { createWebRTCOffer, createWebRTCAnswer, setRemoteDescription };
