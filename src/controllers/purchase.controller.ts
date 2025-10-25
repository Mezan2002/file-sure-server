import type { Response } from "express";
import { PurchaseService } from "../services/purchase.service.js";
import type { AuthRequest } from "../types/index.js";
import type { CreatePurchaseInput } from "../validators/purchase.validator.js";

export class PurchaseController {
  static async createPurchase(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const data: CreatePurchaseInput = req.body;

      const purchase = await PurchaseService.createPurchase(userId, data);

      res.status(201).json({
        success: true,
        message: "Purchase completed successfully",
        data: purchase,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getUserPurchases(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const purchases = await PurchaseService.getUserPurchases(userId);

      res.status(200).json({
        success: true,
        data: purchases,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}