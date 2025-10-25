import mongoose from "mongoose";
import { AppError } from "../middlewares/error.middleware.js";
import { Referral } from "../models/Referral.js";
import { User } from "../models/User.js";
import { JwtUtil } from "../utils/jwt.util.js";
import { ReferralCodeUtil } from "../utils/referralCode.util.js";
import type {
    LoginInput,
    RegisterInput,
} from "../validators/auth.validator.js";

export class AuthService {
  static async register(data: RegisterInput) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new AppError("Email already registered", 400);
      }

      let referralCode = ReferralCodeUtil.generate(data.name);
      let codeExists = await User.findOne({ referralCode });

      while (codeExists) {
        referralCode = ReferralCodeUtil.generate(data.name);
        codeExists = await User.findOne({ referralCode });
      }

      let referrerId: string | undefined;
      if (data.referralCode) {
        const referrer = await User.findOne({
          referralCode: data.referralCode.toUpperCase(),
        });

        if (!referrer) {
          throw new AppError("Invalid referral code", 400);
        }

        referrerId = referrer._id.toString();
      }

      // ✅ FIXED: Get array first, then check for user
      const users = await User.create(
        [
          {
            name: data.name,
            email: data.email,
            password: data.password,
            referralCode,
            referredBy: referrerId,
          },
        ],
        { session }
      );

      const user = users[0];

      // ✅ FIXED: Add null check
      if (!user) {
        throw new AppError("Failed to create user", 500);
      }

      if (referrerId) {
        await Referral.create(
          [
            {
              referrer: referrerId,
              referred: user._id.toString(),
              status: "pending",
              creditAwarded: false,
            },
          ],
          { session }
        );
      }

      await session.commitTransaction();

      const token = JwtUtil.generateToken({
        userId: user._id.toString(),
        email: user.email,
      });

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          referralCode: user.referralCode,
          credits: user.credits,
        },
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async login(data: LoginInput) {
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user || !(await user.comparePassword(data.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = JwtUtil.generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits,
      },
    };
  }

  static async getProfile(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      credits: user.credits,
      hasPurchased: user.hasPurchased,
    };
  }
}