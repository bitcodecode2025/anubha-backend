import express, { Request, Response } from "express";
import prisma from "./database/prismaclient";
// import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes";
import { multerErrorHandler } from "./middleware/multerErrorhandler";

dotenv.config();

const app = express();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/upload", uploadRoutes);

//multer error handler
app.use(multerErrorHandler);

app.get("/", (_req: Request, res: Response) => {
  res.send("Nutriwell backend (TypeScript) running ✅");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
