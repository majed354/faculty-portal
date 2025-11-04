import { z } from 'zod';

export const Term = z.object({
  id: z.string(), // ex: 2025-spring
  title: z.string(), // ex: الفصل الثاني 1447 هـ
  startDate: z.string(), // ISO
  endDate: z.string() // ISO
});
export type Term = z.infer<typeof Term>;

export const terms: Term[] = [
  { id: '2025-fall', title: 'الفصل الأول 1447 هـ', startDate: '2025-08-15', endDate: '2025-12-31' },
  { id: '2025-spring', title: 'الفصل الثاني 1446 هـ', startDate: '2025-01-01', endDate: '2025-05-30' },
  { id: '2024-fall', title: 'الفصل الأول 1446 هـ', startDate: '2024-08-15', endDate: '2024-12-31' }
];

export function orderOf(termId: string) {
  const idx = terms.findIndex(t => t.id === termId);
  return idx === -1 ? 0 : idx;
}
