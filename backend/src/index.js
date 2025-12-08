import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from test!");
});

app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});
