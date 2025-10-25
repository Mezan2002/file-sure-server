import type { Response } from "express";
import { User } from "../models/User.js";
import { ReferralService } from "../services/referral.service.js";
import type { AuthRequest } from "../types/index.js";

export class DashboardController {
  static async getStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const stats = await ReferralService.getDashboardStats(userId);

      const user = await User.findById(userId);

      res.status(200).json({
        success: true,
        data: {
          ...stats,
          currentCredits: user?.credits || 0,
        },
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getReferrals(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const referrals = await ReferralService.getReferralsList(userId);

      res.status(200).json({
        success: true,
        data: referrals,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}