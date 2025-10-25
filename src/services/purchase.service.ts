import mongoose from "mongoose";
import { AppError } from "../middlewares/error.middleware.js";
import { Purchase } from "../models/Purchase.js";
import { User } from "../models/User.js";
import type { CreatePurchaseInput } from "../validators/purchase.validator.js";
import { CreditService } from "./credit.service.js";

export class PurchaseService {
  static async createPurchase(userId: string, data: CreatePurchaseInput) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const isFirstPurchase = !user.hasPurchased;

      // ✅ FIXED: Get array first, then check for purchase
      const purchases = await Purchase.create(
        [
          {
            user: userId,
            productId: data.productId,
            productName: data.productName,
            amount: data.amount,
            isFirstPurchase,
          },
        ],
        { session }
      );

      const purchase = purchases[0];

      // ✅ FIXED: Add null check
      if (!purchase) {
        throw new AppError("Failed to create purchase", 500);
      }

      if (isFirstPurchase) {
        await User.findByIdAndUpdate(
          userId,
          { hasPurchased: true },
          { session }
        );

        await CreditService.awardReferralCredits(userId, session);
      }

      await session.commitTransaction();

      return {
        id: purchase._id,
        productName: purchase.productName,
        amount: purchase.amount,
        isFirstPurchase,
        creditsAwarded: isFirstPurchase,
        createdAt: purchase.createdAt,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getUserPurchases(userId: string) {
    const purchases = await Purchase.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return purchases.map((purchase) => ({
      id: purchase._id,
      productName: purchase.productName,
      amount: purchase.amount,
      isFirstPurchase: purchase.isFirstPurchase,
      createdAt: purchase.createdAt,
    }));
  }
}