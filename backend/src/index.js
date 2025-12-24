import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { server } from "./lib/socket.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
    process.exit(1);
  });
