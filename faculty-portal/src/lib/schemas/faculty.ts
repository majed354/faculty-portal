import { z } from 'zod';
import { Rank, Nationality } from '../types';

const Position = z.object({
  rank: z.custom<Rank>(),
  departmentId: z.string(),
  branchId: z.string(),
  startTermId: z.string(),
  endTermId: z.string().optional()
});

export const Faculty = z.object({
  id: z.string(),
  nameAr: z.string(),
  nameEn: z.string().optional(),
  nationalId: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  nationality: z.custom<Nationality>(),
  positions: z.array(Position).nonempty(),
  createdAt: z.number(),
  updatedAt: z.number()
});

export type Faculty = z.infer<typeof Faculty>;
