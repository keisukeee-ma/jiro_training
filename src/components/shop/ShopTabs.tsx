"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "基本情報", path: "" },
  { label: "メニュー", path: "/menu" },
  { label: "来店フロー", path: "/flow" },
];

export function ShopTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const basePath = `/shops/${slug}`;

  return (
    <nav className="flex border-b border-jiro-border mb-6 overflow-x-auto no-scrollbar -mx-4 px-4">
      {tabs.map((tab) => {
        const href = `${basePath}${tab.path}`;
        const isActive = pathname === href;
        return (
          <Link
            key={tab.path}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors shrink-0 min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow rounded-sm ${
              isActive
                ? "border-jiro-yellow text-jiro-dark"
                : "border-transparent text-jiro-gray hover:text-jiro-dark"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
