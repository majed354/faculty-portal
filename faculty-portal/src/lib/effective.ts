import { orderOf } from './terms';
import { Rank } from './types';

type Interval = { startTermId: string; endTermId?: string };

export function activeAt(termId: string, iv: Interval) {
  const s = orderOf(iv.startTermId);
  const e = iv.endTermId ? orderOf(iv.endTermId) : Number.POSITIVE_INFINITY;
  const t = orderOf(termId);
  return t >= s && t <= e;
}

export function pickEffective<T extends Interval>(termId: string, arr: T[]): T | undefined {
  return arr.find(iv => activeAt(termId, iv));
}

export function rankLabel(r: Rank) {
  return (
    {
      LECTURER: 'محاضر',
      ASSISTANT_PROF: 'أستاذ مساعد',
      ASSOCIATE_PROF: 'أستاذ مشارك',
      PROFESSOR: 'أستاذ'
    } as const
  )[r];
}
