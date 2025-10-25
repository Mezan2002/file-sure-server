import mongoose, { Schema } from "mongoose";
import type { IPurchase } from "../types/index.js";

const purchaseSchema = new Schema<IPurchase>(
  {
    user: {
      type: String,
      ref: "User",
      required: [true, "User is required"],
    },
    productId: {
      type: String,
      required: [true, "Product ID is required"],
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    isFirstPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

purchaseSchema.index({ user: 1 });
purchaseSchema.index({ createdAt: -1 });
purchaseSchema.index({ isFirstPurchase: 1 });

export const Purchase = mongoose.model<IPurchase>("Purchase", purchaseSchema);