// routers/wsRouter.js
const { v4: uuidv4 } = require("uuid");
const { createSession, getSession, updateSession } = require("../sessionStore");

const setupWebSocketHandlers = (io) => {
    io.on("connection", (socket) => {
      //console.log("A client connected:", socket.id);
      socket.on('create-session', ({ fileName, fileSize, senderId }, callback) => {
        const sessionId = uuidv4();
        socket.join(sessionId);
        createSession(sessionId, { fileName, fileSize, senderId });
        const link = `${process.env.CLIENT_URL}/download/${sessionId}`;
        if(sessionId) {
          callback({
            status: 'success',
            link: link,
            sessionId: sessionId
        });
        }
        else{
          callback({
            status: 'failure',
            message: 'Session creation failed',
            error: 'Session creation failed'
        });
        }
        //console.log('download link sent to client:', link);
      });
      
      socket.on("join-room", (sessionId) => {
        console.log(`Client ${socket.id} joined room ${sessionId}`);
        let session = getSession(sessionId);
        updateSession(sessionId, { receiverId: socket.id });
        console.log('hello1');
        socket.join(sessionId);
        console.log('hello2');
        // notify sender that receiver has joined.
        console.log(`Notifying sender ${session.senderId} that receiver has joined.`);
        socket.to(session.senderId).emit("receiver-joined", { receiverId: socket.id });
      });
      // listen for webrtc offer
      socket.on("webRTC-offer", (data) => {
        console.log("WebRTC offer received:", data);
        // Broadcast offer to the receiver in the room
        console.log(data.offer);
        const offer = data.offer;
        socket.to(data.sessionId).emit("webRTC-offer", {offer});
      });
      
      socket.on("webRTC-answer", (data) => {
        console.log("WebRTC answer received:", data);
        // Broadcast answer to the sender in the room
        const answer = data.answer;
        socket.to(data.sessionId).emit("webRTC-answer", {answer});
      });
      // socket.on("disconnect", () => {
      //   console.log("A client disconnected:", socket.id);
      // });
    });
  };
  
  module.exports = setupWebSocketHandlers;
  