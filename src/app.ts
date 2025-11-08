import express, { Request, Response } from "express";
import prisma from "./database/prismaclient";
// import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes";
import { multerErrorHandler } from "./middleware/multerErrorhandler";
import formroutes from "./routes/formroutes";

dotenv.config();

const app = express();

// app.use(cors());
app.use(express.json({ limit: "20mb" })); // to support formData JSON uploads
app.use(express.urlencoded({ extended: true }));

//routes

console.log("hello world");

app.use((req, res, next) => {
  console.log("📩 Incoming:", req.method, req.originalUrl);
  next();
});

app.use("/api/upload", uploadRoutes);
app.use("/api/forms", formroutes);

console.log("hello bitcode");
//multer error handler
app.use(multerErrorHandler);

app.get("/", (_req: Request, res: Response) => {
  res.send("Nutriwell backend (TypeScript) running ✅");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
