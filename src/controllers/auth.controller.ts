import type { Response } from "express";
import { AuthService } from "../services/auth.service.js";
import type { AuthRequest } from "../types/index.js";
import type {
    LoginInput,
    RegisterInput,
} from "../validators/auth.validator.js";

export class AuthController {
  static async register(req: AuthRequest, res: Response) {
    try {
      const data: RegisterInput = req.body;
      const result = await AuthService.register(data);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(req: AuthRequest, res: Response) {
    try {
      const data: LoginInput = req.body;
      const result = await AuthService.login(data);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const profile = await AuthService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
}