const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const httpRouter = require("./router/httpRouter.js");
const setupWebSocketHandlers = require("./router/wsRouter.js");
const http = require('http');
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());

app.use(httpRouter);

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});

// Attach WebSocket handlers
setupWebSocketHandlers(io);

// Start the combined HTTP and WebSocket server
server.listen(process.env.HTTP_PORT, () => {
  console.log(`Server is running on port ${process.env.HTTP_PORT}`);
});
