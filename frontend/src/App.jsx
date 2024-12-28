import { useState } from "react";
//import {QRCode} from "qrcode.react";
import './index.css'

const App = () => {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const generateLink = () => {
    if (file) {
      const roomId = Math.random().toString(36).substring(2, 10);
      setLink(`http://localhost:3000/${roomId}`);
    } else {
      alert("Please upload a file first!");
    }
  };
  const handleCopyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied status after 2 seconds
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl flex flex-col items-center">
      <h1 className="text-5xl font-bold text-lime-600 mb-8">Share Your Files Instantly</h1>

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

      <button
        className="mt-4 px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700"
        onClick={generateLink}
      >
        Generate Link
      </button>

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
          <div className="mt-4 flex justify-center"> 
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default App;
//<QRCode value={link} size={150} className="border p-2 bg-white" />
