import { Router } from "express";
import { createUserForm } from "../controllers/formcontroller";

const formroutes = Router();

formroutes.post("/", createUserForm);

export default formroutes;
