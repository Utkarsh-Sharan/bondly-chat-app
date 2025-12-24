import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { socketAuth } from "../middlewares/socket.auth.middleware.js";
import app from "../app.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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

//check if user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io, app, server };
