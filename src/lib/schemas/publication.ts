import { z } from 'zod';

export const Publication = z.object({
  id: z.string(),
  memberId: z.string(),
  year: z.number().int(),
  title: z.string(),
  venue: z.string().optional(),
  doi: z.string().optional()
});
export type Publication = z.infer<typeof Publication>;
