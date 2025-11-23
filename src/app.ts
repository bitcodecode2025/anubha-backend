import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes";
import { multerErrorHandler } from "./middleware/multerErrorhandler";
import authRoutes from "./modules/auth/auth.routes";
import patientRoutes from "./modules/patient/patient.routes";
import { attachUser } from "./middleware/attachUser";
import slotRoutes from "./modules/slots/slots.routes";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(attachUser);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/public", (req, res) => {
  return res.json({
    message: "Public route working",
    user: req.user || null,
  });
});

//routes
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/api/upload", uploadRoutes);
app.use(multerErrorHandler);
app.use("/api/slots", slotRoutes);

//_________________________________________________________________________________________
app.get("/", (_req: Request, res: Response) => {
  res.send("Nutriwell backend (TypeScript) running ✅");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
