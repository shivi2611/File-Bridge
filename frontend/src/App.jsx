import { useState, useEffect } from "react";
import './index.css';
import io from 'socket.io-client';
import {createWebRTCOffer, setRemoteDescription} from './WebRTC';

const socket = io.connect('http://localhost:3000', { reconnection: false });

const App = () => {
  const [file, setFile] = useState(null); 
  const [link, setLink] = useState(""); 
  const [copied, setCopied] = useState(false); 
  const [sessionId, setSessionId] = useState(null); 

  useEffect(() => {
    socket.on('receiver-joined', async (data) => {
      // send webrtc offer
      try{
        const offer = await createWebRTCOffer(file);
        console.log(sessionId); // remove sessionId.
        socket.emit("webRTC-offer", { offer, sessionId });
      }
      catch(error){
        console.error("Error creating WebRTC offer", error);
      }
      console.log('Reciever joined:', data);
    });
    return () => {
      socket.off('receiver-joined');
    };
  }, [sessionId, file]);

  useEffect(() => {
    // Debug connection events
    socket.on('connect', () => {
      console.log('Connected to the server. Socket ID:', socket.id);
    });
    socket.on('webRTC-answer', async ({answer}) => {
      console.log('Received WebRTC answer:', answer);
      try{
        await setRemoteDescription(answer);
      }
      catch(error){
        console.error("Error setting remote description:", error);
      }
    });
    return () => {
      socket.off('connect');
      socket.off('webRTC-answer');
    };
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const generateLink = () => {
    if (file) {
      console.log('Selected file:', file);

      // Emit create-session event with necessary data
      socket.emit(
        'create-session',
        { fileName: file.name, fileSize: file.size, senderId: socket.id },
        (response) => {
          console.log('Response from server:', response);
          if (response.status === 'success') {
            setLink(response.link);
            console.log('Session ID:', response.sessionId);
            setSessionId(response.sessionId); 
            //console.log('yo ' , sessionId);
          } else {
            console.error('Session creation failed:', response.error);
            setLink('Error');
          }
        }
      );
    } else {
      alert("Please upload a file first!");
    }
  };

  const handleCopyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-5xl font-bold text-lime-600 mb-8">Share Your Files Instantly</h1>

        {/* File Upload Section */}
        <div
          className="w-80 h-40 border-2 border-dashed border-lime-600 rounded-lg flex items-center justify-center bg-white cursor-pointer hover:bg-lime-100"
          onClick={() => document.getElementById("fileInput").click()}
        >
          {file ? (
            <p className="text-gray-700 font-medium">{file.name}</p>
          ) : (
            <p className="text-gray-500">Click or Drag & Drop to Upload a File</p>
          )}
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* Generate Link Button */}
        <button
          className="mt-4 px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700"
          onClick={generateLink}
        >
          Generate Link
        </button>

        {/* Display Link Section */}
        {link && (
          <div className="mt-6 text-center">
            <p className="text-gray-700">Share this link:</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime-600 font-medium underline"
            >
              {link}
            </a>
            <button
              className="px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 m-2"
              onClick={handleCopyLink}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;