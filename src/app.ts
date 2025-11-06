import express from "express";
import prisma from "./database/prismaclient";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world from bitcode , backend is running properly");
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}/`);
});
