'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function ReportBuilder() {
  const [asOf, setAsOf] = useState('2025-spring');
  const [cols, setCols] = useState<string[]>(['name','rank','dept','nationality']);

  const query = useMemo(()=>{
    const p = new URLSearchParams();
    p.set('asOf', asOf);
    p.set('cols', cols.join(','));
    return p.toString();
  }, [asOf, cols]);

  function toggle(col: string) {
    setCols(prev => prev.includes(col) ? prev.filter(c=>c!==col) : [...prev, col]);
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3 bg-white p-3 rounded-xl shadow">
        <label className="text-sm">فصل التقرير (asOf)
          <select className="border rounded w-full mt-1 px-2 py-1" value={asOf} onChange={e=>setAsOf(e.target.value)}>
            <option value="2025-fall">الفصل الأول 1447</option>
            <option value="2025-spring">الفصل الثاني 1446</option>
            <option value="2024-fall">الفصل الأول 1446</option>
          </select>
        </label>
        <fieldset className="md:col-span-2">
          <legend className="text-sm font-medium">أعمدة التقرير</legend>
          <div className="flex flex-wrap gap-2 mt-1">
            {['name','rank','dept','branch','nationality'].map(c=> (
              <label key={c} className="inline-flex items-center gap-1 text-sm border px-2 py-1 rounded">
                <input type="checkbox" checked={cols.includes(c)} onChange={()=>toggle(c)} /> {c}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="flex gap-3">
        <Link className="bg-black text-white px-4 py-2 rounded" href={`/reports/print?${query}`} target="_blank">عرض للطباعة</Link>
      </div>
    </div>
  );
}
