"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4" aria-hidden>
        ⚠️
      </div>
      <h1 className="text-2xl font-bold mb-2">エラーが発生しました</h1>
      <p className="text-sm text-jiro-gray mb-8">
        ページの表示中に問題が発生しました。時間をおいて再度お試しください。
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={reset}
          className="min-h-[44px] px-6 py-2.5 bg-jiro-yellow text-jiro-dark rounded-lg font-medium hover:bg-yellow-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-dark focus-visible:ring-offset-2"
        >
          再読み込み
        </button>
        <Link
          href="/"
          className="min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 border border-jiro-border rounded-lg font-medium hover:bg-gray-50"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
