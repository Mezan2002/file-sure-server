import type { Request } from "express";
import type { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  referralCode: string;
  credits: number;
  referredBy?: string;
  hasPurchased: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IReferral extends Document {
  referrer: string;
  referred: string;
  status: "pending" | "converted";
  creditAwarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchase extends Document {
  user: string;
  productId: string;
  productName: string;
  amount: number;
  isFirstPurchase: boolean;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface DashboardStats {
  totalReferredUsers: number;
  convertedUsers: number;
  totalCreditsEarned: number;
  referralLink: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}