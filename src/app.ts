import express, { Request, Response } from "express";
import prisma from "./database/prismaclient";

// import cors from "cors";
import dotenv from "dotenv";
// import formRoutes from "./routes/formRoutes";

dotenv.config();

const app = express();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Nutriwell backend (TypeScript) running ✅");
});

// app.use("/api/form", formRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
