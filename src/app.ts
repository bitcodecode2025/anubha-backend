import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
// import uploadRoutes from "./routes/uploadRoutes";
// import { multerErrorHandler } from "./middleware/multerErrorhandler";
// import formroutes from "./routes/formroutes";
import authRoutes from "./modules/auth/auth.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" })); // to support formData JSON uploads
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/auth", authRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/forms", formroutes);
// app.use(multerErrorHandler);

app.get("/", (_req: Request, res: Response) => {
  res.send("Nutriwell backend (TypeScript) running ✅");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
