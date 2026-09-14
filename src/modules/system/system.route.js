import { Router } from 'express';
import systemController from './system.controller.js';

const router = Router();

router.get("/memory", systemController.showMemUsage);
router.get("/storage", systemController.showStorageUsage);
router.get("/uptime", systemController.showUptimeInfo);

export default router;