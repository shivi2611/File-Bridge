import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { createWebRTCAnswer } from "./WebRTC";

const socket = io("http://localhost:3000", { reconnection: false });

const DownloadPage = () => {
  const { sessionId } = useParams(); // Extract sessionId from URL
  const [fileDetails, setFileDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    alert('Do you want to download the file?');
    socket.on("webRTC-offer", async({ offer }) => {
      console.log("Received WebRTC offer:", offer);
    
      const answer = await createWebRTCAnswer(offer);
      //console.log(sessionId);
      //console.log(answer);
      socket.emit("webRTC-answer", { answer, sessionId });
    
      //console.log("Sent WebRTC answer to sender");
    });
  }, []);

  useEffect(() => {
    const fetchFileDetails = async () => {
      console.log('hello');
      console.log(sessionId);
      try {
        const response = await axios.get(`http://localhost:3000/download/${sessionId}`);
        if (response.data.status === "success") {
          setFileDetails(response.data);

          //Join WebSocket room
          socket.emit("join-room",  sessionId , (wsResponse) => {
            if (wsResponse.status !== "success") {
              console.log("sent join room request");
              setError(wsResponse.message);
            }
          });
        } else {
          setError("Failed to fetch session details.");
        }
      } catch (err) {
        setError("Failed to fetch session details: " + err.message);
      }
    };

    fetchFileDetails();
  }, [sessionId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return fileDetails ? (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl flex flex-col items-center">
    <div>
      <h1 className="text-5xl font-bold text-lime-600 mb-8">Download File</h1>
      <p className="text-gray-700 font-medium">File Name: {fileDetails.fileName}</p>
      <p className="text-gray-700 font-medium">File Size: {fileDetails.fileSize} bytes</p>
    </div>
    </div>
    </div>
  ) : (
    <p>Loading file details...</p>
  );
};

export default DownloadPage;


// ensure file details come to donwload page -- done
// ws - make request and join room -- done
// download button - on click - initaites the p2p connection and then download
// write logic for p2p connection and download.
// designing 

// estimated time - 4 hours