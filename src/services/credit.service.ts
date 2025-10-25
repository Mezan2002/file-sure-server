import type mongoose from "mongoose";
import { env } from "../config/env.js";
import { Referral } from "../models/Referral.js";
import { User } from "../models/User.js";

export class CreditService {
  static async awardReferralCredits(
    referredUserId: string,
    session: mongoose.ClientSession
  ): Promise<void> {
    const referral = await Referral.findOne({
      referred: referredUserId,
      creditAwarded: false,
    }).session(session);

    if (!referral) {
      return;
    }

    const creditAmount = env.REFERRAL_CREDIT_AMOUNT;

    await Promise.all([
      User.findByIdAndUpdate(
        referral.referrer,
        { $inc: { credits: creditAmount } },
        { session }
      ),
      User.findByIdAndUpdate(
        referredUserId,
        { $inc: { credits: creditAmount } },
        { session }
      ),
      Referral.findByIdAndUpdate(
        referral._id,
        {
          status: "converted",
          creditAwarded: true,
        },
        { session }
      ),
    ]);
  }
}