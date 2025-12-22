import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuth } from "../middlewares/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

//socket auth middleware for all socket connections
io.use(socketAuth);

//for storing online users
const userSocketMap = {};

//handilng online and offline users
io.on("connection", (socket) => {
  const userId = socket.userId;
  userSocketMap[userId] = socket.id; //updated the list only in the backend

  //raise an event to all socket clients that this user just connected
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //update the user socket map when someone disconnects
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
