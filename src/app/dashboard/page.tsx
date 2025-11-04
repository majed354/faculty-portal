'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/db/firebase';

export default function Dashboard() {
  const [latest, setLatest] = useState<{ id: string; text: string; at: number }[]>([]);

  useEffect(()=>{
    (async()=>{
      const qy = query(collection(db, 'activity_log'), orderBy('at','desc'), limit(10));
      const snap = await getDocs(qy);
      setLatest(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) })));
    })();
  },[]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">آخر التحديثات</h3>
        <ul className="text-sm space-y-2">
          {latest.map(l => (
            <li key={l.id} className="border-b pb-2">
              <div>{l.text}</div>
              <div className="text-gray-500 text-xs">{new Date(l.at).toLocaleString('ar-SA')}</div>
            </li>
          ))}
          {latest.length===0 && <li className="text-gray-500">لا توجد تحديثات بعد.</li>}
        </ul>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">إحصاءات سريعة (عينات)</h3>
        <p className="text-sm text-gray-600">أضف هنا بطاقات الإحصاء (عدد الأعضاء، التوزيع حسب الرتبة…).</p>
      </div>
    </div>
  );
}
