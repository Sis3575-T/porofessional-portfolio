import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const router = express.Router();

export function setupSocketIO(app) {
  const server = http.createServer(app);
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-visitor-room", (visitorId) => {
      socket.join(visitorId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

export default router;
