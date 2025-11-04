export default function PrintHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      <hr className="mt-3"/>
    </div>
  );
}
