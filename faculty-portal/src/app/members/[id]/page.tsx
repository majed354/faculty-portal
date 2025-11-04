'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/db/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function MemberView({ params }: { params: { id: string } }) {
  const [m, setM] = useState<any|null>(null);
  useEffect(()=>{ (async()=>{ const s=await getDoc(doc(db,'faculty', params.id)); setM(s.exists()? { id:s.id, ...(s.data() as any)}: null); })(); },[params.id]);
  if (m===null) return <div>جاري التحميل…</div>;
  if (!m) return <div>غير موجود</div>;
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{m.nameAr}</h2>
      <pre className="bg-gray-50 p-3 rounded">{JSON.stringify(m, null, 2)}</pre>
    </div>
  );
}
