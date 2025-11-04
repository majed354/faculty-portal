'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/db/firebase';
import PrintHeader from '@/components/PrintHeader';
import { pickEffective, rankLabel } from '@/lib/effective';

export default function PrintReport() {
  const sp = useSearchParams();
  const asOf = sp.get('asOf') || undefined;
  const cols = (sp.get('cols')||'name,rank,dept,nationality').split(',');
  const [rows, setRows] = useState<any[]>([]);

  useEffect(()=>{ (async()=>{
    const snap = await getDocs(collection(db,'faculty'));
    setRows(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) })));
  })(); },[]);

  const data = useMemo(()=>{
    return rows.map(m => {
      const eff = asOf ? pickEffective(asOf, m.positions) : m.positions.at(-1);
      return {
        name: m.nameAr,
        rank: eff ? rankLabel(eff.rank) : '—',
        dept: eff?.departmentId ?? '—',
        branch: eff?.branchId ?? '—',
        nationality: m.nationality==='SAUDI'?'سعودي':'غير سعودي',
      };
    });
  }, [rows, asOf]);

  return (
    <div className="p-6">
      <div className="no-print mb-4"><button onClick={()=>window.print()} className="bg-black text-white px-4 py-2 rounded">طباعة</button></div>
      <PrintHeader title="تقرير أعضاء هيئة التدريس" subtitle={asOf?`حتى فصل: ${asOf}`:undefined} />
      <table className="w-full text-sm">
        <thead>
          <tr>
            {cols.map(c => (<th key={c} className="text-right border-b py-2">{c}</th>))}
          </tr>
        </thead>
        <tbody>
          {data.map((r,i)=> (
            <tr key={i} className="border-b print-p">
              {cols.map(c => (<td key={c} className="py-2">{(r as any)[c]}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
