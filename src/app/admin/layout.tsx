import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-jiro-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/admin" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 bg-jiro-dark rounded-full flex items-center justify-center font-bold text-sm text-white">
              J
            </span>
            <span className="font-bold text-jiro-dark hidden sm:inline">管理画面</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar">
            <Link
              href="/admin"
              className="text-sm text-jiro-gray hover:text-jiro-dark px-2 py-1 shrink-0"
            >
              店舗
            </Link>
            <Link
              href="/admin/comments"
              className="text-sm text-jiro-gray hover:text-jiro-dark px-2 py-1 shrink-0"
            >
              報告
            </Link>
            <Link
              href="/"
              className="text-sm text-jiro-gray hover:text-jiro-dark px-2 py-1 shrink-0"
            >
              サイト
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { deleteSession } = await import("@/lib/auth");
        await deleteSession();
        const { redirect } = await import("next/navigation");
        redirect("/admin/login");
      }}
    >
      <button
        type="submit"
        className="text-sm text-jiro-gray hover:text-red-600"
      >
        ログアウト
      </button>
    </form>
  );
}
