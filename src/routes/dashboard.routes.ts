import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/stats", authenticate, DashboardController.getStats);
router.get("/referrals", authenticate, DashboardController.getReferrals);

export default router;