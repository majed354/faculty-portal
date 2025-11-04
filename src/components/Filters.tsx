'use client';
import { useState } from 'react';

export type FiltersState = {
  termId?: string;
  departmentId?: string;
  branchId?: string;
  rank?: string;
  nationality?: string;
  q?: string;
};

export default function Filters({ onChange, initial }: {
  onChange: (f: FiltersState) => void;
  initial?: FiltersState;
}) {
  const [f, setF] = useState<FiltersState>(initial ?? {});
  function upd(part: Partial<FiltersState>) {
    const nf = { ...f, ...part };
    setF(nf); onChange(nf);
  }
  return (
    <div className="grid md:grid-cols-6 gap-3 bg-white p-3 rounded-xl shadow">
      <input className="border rounded px-2 py-1 md:col-span-2" placeholder="بحث بالاسم" value={f.q ?? ''}
        onChange={e=>upd({q:e.target.value})}/>
      <select className="border rounded px-2 py-1" value={f.termId ?? ''} onChange={e=>upd({termId:e.target.value||undefined})}>
        <option value="">كل الفصول</option>
        <option value="2025-fall">الفصل الأول 1447</option>
        <option value="2025-spring">الفصل الثاني 1446</option>
        <option value="2024-fall">الفصل الأول 1446</option>
      </select>
      <select className="border rounded px-2 py-1" value={f.departmentId ?? ''} onChange={e=>upd({departmentId:e.target.value||undefined})}>
        <option value="">كل الأقسام</option>
        <option value="CS">علوم الحاسب</option>
        <option value="IS">نظم المعلومات</option>
      </select>
      <select className="border rounded px-2 py-1" value={f.branchId ?? ''} onChange={e=>upd({branchId:e.target.value||undefined})}>
        <option value="">كل الفروع</option>
        <option value="MAIN">المقر الرئيسي</option>
        <option value="BR1">الفرع 1</option>
      </select>
      <select className="border rounded px-2 py-1" value={f.rank ?? ''} onChange={e=>upd({rank:e.target.value||undefined})}>
        <option value="">كل الرتب</option>
        <option value="LECTURER">محاضر</option>
        <option value="ASSISTANT_PROF">أستاذ مساعد</option>
        <option value="ASSOCIATE_PROF">أستاذ مشارك</option>
        <option value="PROFESSOR">أستاذ</option>
      </select>
      <select className="border rounded px-2 py-1" value={f.nationality ?? ''} onChange={e=>upd({nationality:e.target.value||undefined})}>
        <option value="">كل الجنسيات</option>
        <option value="SAUDI">سعودي</option>
        <option value="FOREIGN">غير سعودي</option>
      </select>
    </div>
  );
}
