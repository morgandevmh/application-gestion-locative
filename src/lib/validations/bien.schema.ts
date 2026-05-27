import * as z from "zod";

export const createBienSchema = z.object({
  nom: z.string(),
  adresse: z.string(),
  type: z.enum([
    "APPARTEMENT",
    "MAISON",
    "STUDIO",
    "COLOCATION"
  ]),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  capacite: z.number().optional()
});

export type CreateBienInput = z.infer<typeof createBienSchema>;

export const updateBienSchema = createBienSchema
  .omit({ type: true })
  .extend({
    photos: z.array(z.string()).optional(),
  })
  .partial();

export type UpdateBienInput = z.infer<typeof updateBienSchema>;