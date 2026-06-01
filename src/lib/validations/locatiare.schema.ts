import * as z from "zod";

export const createLocataireSchema = z.object({
  nom: z.string(),
  email: z.string().email().optional().nullable(),
  telephone: z.string().optional().nullable(),
  dateEntree: z.string().datetime(),
  dateSortie: z.string().datetime().optional().nullable(),
  caution: z.number().nonnegative(),
  statut: z.enum(["ACTIF", "SORTI"]).optional(),
  notes: z.string().optional().nullable(),
});

export type CreateLocataireInput = z.infer<typeof createLocataireSchema>;

export const updateLocataireSchema = createLocataireSchema.partial();

export type UpdateLocataireInput = z.infer<typeof updateLocataireSchema>;