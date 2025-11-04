import { z } from 'zod';

export const Course = z.object({
  id: z.string(),
  memberId: z.string(),
  termId: z.string(),
  code: z.string(),
  title: z.string(),
  section: z.string().optional(),
  hours: z.number().int().nonnegative().default(0)
});
export type Course = z.infer<typeof Course>;
