import { z } from "zod";

export const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(), // just check it's provided
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
    })
  )
});
