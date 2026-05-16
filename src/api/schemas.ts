import { z } from 'zod';

/** Response contracts for the Toolshop REST API, validated in the API specs. */

export const loginResponseSchema = z.object({
  access_token: z.string().min(10),
  token_type: z.literal('bearer'),
  expires_in: z.number().positive(),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  is_location_offer: z.boolean(),
  is_rental: z.boolean(),
});

const namedRef = z.object({ id: z.string(), name: z.string() });

export const productDetailSchema = productSchema.extend({
  in_stock: z.boolean().optional(),
  is_eco_friendly: z.boolean().optional(),
  product_image: z.unknown().optional(),
  brand: namedRef.optional(),
  category: namedRef.optional(),
});

export const paginatedProductsSchema = z.object({
  current_page: z.number(),
  data: z.array(productSchema),
  total: z.number(),
  last_page: z.number(),
  per_page: z.number(),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  parent_id: z.string().nullable(),
});

export const brandSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export type Product = z.infer<typeof productSchema>;
export type PaginatedProducts = z.infer<typeof paginatedProductsSchema>;
