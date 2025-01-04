import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import DownloadPage from "./DownloadPage";

// Ensure this code is only called once
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Route for file upload page */}
        <Route path="/" element={<App />} />

        {/* Route for download page */}
        <Route path="/download/:sessionId" element={<DownloadPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
