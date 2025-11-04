'use client';
import * as React from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { pickEffective, rankLabel } from '@/lib/effective';

export type FacultyRow = {
  id: string;
  nameAr: string;
  nationality: 'SAUDI'|'FOREIGN';
  positions: { rank: any; departmentId: string; branchId: string; startTermId: string; endTermId?: string }[];
};

export default function FacultyTable({ data, termId }: { data: FacultyRow[]; termId?: string }) {
  const columns = React.useMemo<ColumnDef<FacultyRow>[]>(() => [
    { accessorKey: 'nameAr', header: 'الاسم' },
    { id: 'rank', header: 'الرتبة (حسب الفصل)', cell: ({ row }) => {
      const eff = termId ? pickEffective(termId, row.original.positions) : row.original.positions.at(-1);
      return eff ? rankLabel(eff.rank) : '—';
    }},
    { id: 'dept', header: 'القسم', cell: ({ row }) => {
      const eff = termId ? pickEffective(termId, row.original.positions) : row.original.positions.at(-1);
      return eff?.departmentId ?? '—';
    }},
    { accessorKey: 'nationality', header: 'الجنسية', cell: ({ getValue }) => (getValue()==='SAUDI'?'سعودي':'غير سعودي') },
  ], [termId]);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel() });

  const totals = React.useMemo(() => {
    let sa=0, fo=0; let ranks: Record<string, number> = {};
    for (const m of data) {
      const eff = termId ? pickEffective(termId, m.positions) : m.positions.at(-1);
      if (!eff) continue;
      if (m.nationality==='SAUDI') sa++; else fo++;
      const r = eff.rank; ranks[r] = (ranks[r]||0)+1;
    }
    return { sa, fo, ranks };
  }, [data, termId]);

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-3 text-sm text-gray-700 border-b flex gap-6">
        <div>السعوديون: <b>{totals.sa}</b></div>
        <div>غير السعوديين: <b>{totals.fo}</b></div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(hg=> (
            <tr key={hg.id}>{hg.headers.map(h=> (
              <th key={h.id} className="text-right px-3 py-2">
                {flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}</tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(r => (
            <tr key={r.id} className="border-t">
              {r.getVisibleCells().map(c => (
                <td key={c.id} className="px-3 py-2">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
