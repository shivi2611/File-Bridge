const express = require("express");
const { createSession, getSession } = require("../sessionStore");
const router = express.Router();


/*router.post("/createLink", (req, res) => {
  // get file details.
  // create a session id and a random link.
  // send this random link to the user.
  const { fileName, fileSize } = req.body;
  const senderId = uuidv4();
  const sessionId = uuidv4();
  const socket = io.connect('https://localhost:5000');
  socket.emit('create-session', { sessionId, senderId: senderId });
  createSession(sessionId, { fileName: fileName, Size: fileSize, SenderId: senderId });
  const downloadLink = `${process.env.CLIENT_URL}/download/${sessionId}`;
});*/
router.get("/download/:sessionId", (req, res) => {
  console.log('download request received');
  const sessionId = req.params.sessionId;
  const session = getSession(sessionId);
  console.log(session);
  if(!session) {
    res.json({ status: 'failure', message: 'Invalid Link' });
  }
  else{
    // send metadata to the user.
    
    res.json({ status: 'success', fileName: session.fileName, fileSize: session.fileSize });
  }
});

module.exports = router;
