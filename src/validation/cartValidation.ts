import { z } from "zod";

export const cartSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  products: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    )
    .nonempty("At least one product is required"),
});

// ✅ Export type for TypeScript
export type CartInput = z.infer<typeof cartSchema>;
