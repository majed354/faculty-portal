'use client';
import Link from 'next/link';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">بوابة أعضاء هيئة التدريس</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/">الرئيسية</Link>
            <Link href="/dashboard">لوحة التحكم</Link>
            <Link href="/members">الأعضاء</Link>
            <Link href="/reports">التقارير</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
