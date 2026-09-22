import { Router } from "express";
import { handleWebhook } from "./deploy.controller.js";
import { verifyWebhookSignature } from "../../middlewares/verifyWebhookSignature.js";

const router = Router();

router.post("/webhook", verifyWebhookSignature, handleWebhook);

export default router;