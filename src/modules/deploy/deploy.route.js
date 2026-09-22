import { Router } from "express";
import { handleWebhook } from "./deploy.controller.js";

const router = Router();

router.post("/webhook", handleWebhook);

export default router;