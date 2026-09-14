import { Router } from "express";
import { getSshStatus } from "./services-status.controller.js";

const router = Router();

router.get("/ssh", getSshStatus);

export default router;