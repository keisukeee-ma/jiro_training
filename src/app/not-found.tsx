import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4" aria-hidden>
        🍜
      </div>
      <h1 className="text-2xl font-bold mb-2">ページが見つかりません</h1>
      <p className="text-sm text-jiro-gray mb-8">
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-jiro-yellow text-jiro-dark rounded-lg font-medium hover:bg-yellow-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-dark focus-visible:ring-offset-2"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
