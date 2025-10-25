import mongoose, { Schema } from "mongoose";
import type { IReferral } from "../types/index.js";

const referralSchema = new Schema<IReferral>(
  {
    referrer: {
      type: String,
      ref: "User",
      required: [true, "Referrer is required"],
    },
    referred: {
      type: String,
      ref: "User",
      required: [true, "Referred user is required"],
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "converted"],
      default: "pending",
    },
    creditAwarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

referralSchema.index({ referrer: 1 });
referralSchema.index({ referred: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ creditAwarded: 1 });
referralSchema.index({ referrer: 1, referred: 1 }, { unique: true });

export const Referral = mongoose.model<IReferral>("Referral", referralSchema);