import { z } from "zod";

export const saleSchema = z.object({
  seller_id: z.string().min(1, "Selecione um vendedor"),
  customer_id: z.string().min(1, "Selecione um cliente"),
});