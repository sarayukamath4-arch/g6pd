import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
        G
      </div>
      <div>
        <strong className="block text-white font-semibold">GeneGuide</strong>
        <span className="text-xs text-emerald-200">Personal health intelligence</span>
      </div>
    </Link>
  );
}