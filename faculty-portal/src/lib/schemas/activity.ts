import { z } from 'zod';

export const Activity = z.object({
  id: z.string(),
  memberId: z.string(),
  termId: z.string(),
  type: z.enum(['committee', 'community', 'training', 'admin']),
  title: z.string(),
  hours: z.number().int().nonnegative().default(0)
});
export type Activity = z.infer<typeof Activity>;
