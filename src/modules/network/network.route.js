import { Router } from "express";
import { getConnectionStatus, getDeviceLocalIP } from "./network.controller.js";

const router = Router();

router.get("/connection", getConnectionStatus);
router.get("/localip", getDeviceLocalIP);

export default router;