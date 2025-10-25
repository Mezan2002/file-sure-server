import { env } from "../config/env.js";
import { Referral } from "../models/Referral.js";
import { User } from "../models/User.js";
import type { DashboardStats } from "../types/index.js";

export class ReferralService {
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const referrals = await Referral.find({ referrer: userId });

    const totalReferredUsers = referrals.length;
    const convertedUsers = referrals.filter(
      (ref) => ref.status === "converted"
    ).length;

    const totalCreditsEarned = convertedUsers * env.REFERRAL_CREDIT_AMOUNT;

    const referralLink = `${env.FRONTEND_URL}/register?r=${user.referralCode}`;

    return {
      totalReferredUsers,
      convertedUsers,
      totalCreditsEarned,
      referralLink,
    };
  }

  static async getReferralsList(userId: string) {
    const referrals = await Referral.find({ referrer: userId })
      .populate("referred", "name email createdAt hasPurchased")
      .sort({ createdAt: -1 })
      .lean();

    return referrals.map((ref: any) => ({
      id: ref._id,
      userName: ref.referred.name,
      userEmail: ref.referred.email,
      status: ref.status,
      hasPurchased: ref.referred.hasPurchased,
      joinedAt: ref.createdAt,
    }));
  }
}