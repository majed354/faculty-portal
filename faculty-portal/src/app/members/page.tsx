'use client';
import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/db/firebase';
import Filters, { FiltersState } from '@/components/Filters';
import FacultyTable from '@/components/FacultyTable';
import { pickEffective } from '@/lib/effective';

export default function MembersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [f, setF] = useState<FiltersState>({});

  useEffect(()=>{
    (async()=>{
      const snap = await getDocs(collection(db,'faculty'));
      setRows(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) })));
    })();
  },[]);

  const filtered = useMemo(()=>{
    let list = rows;
    if (f.q) list = list.filter((x:any)=> x.nameAr.includes(f.q!));
    if (f.nationality) list = list.filter((x:any)=> x.nationality===f.nationality);
    if (f.termId) {
      list = list.filter((x:any)=> pickEffective(f.termId!, x.positions));
    }
    if (f.rank && f.termId) {
      list = list.filter((x:any)=> pickEffective(f.termId!, x.positions)?.rank===f.rank);
    }
    if (f.departmentId && f.termId) {
      list = list.filter((x:any)=> pickEffective(f.termId!, x.positions)?.departmentId===f.departmentId);
    }
    if (f.branchId && f.termId) {
      list = list.filter((x:any)=> pickEffective(f.termId!, x.positions)?.branchId===f.branchId);
    }
    return list;
  }, [rows, f]);

  return (
    <div className="space-y-4">
      <Filters onChange={setF} />
      <FacultyTable data={filtered} termId={f.termId} />
    </div>
  );
}
