import { z } from "zod";

export const createPurchaseSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product name is required"),
  amount: z.number().positive("Amount must be positive"),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;