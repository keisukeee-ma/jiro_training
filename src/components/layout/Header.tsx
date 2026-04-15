import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-jiro-border bg-white sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 bg-jiro-yellow rounded-full flex items-center justify-center font-bold text-sm text-jiro-dark">
            J
          </span>
          <span className="font-bold text-lg text-jiro-dark">二郎マップ</span>
        </Link>
      </div>
    </header>
  );
}
