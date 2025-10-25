import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { createPurchaseSchema } from "../validators/purchase.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validateRequest(createPurchaseSchema),
  PurchaseController.createPurchase
);
router.get("/", authenticate, PurchaseController.getUserPurchases);

export default router;