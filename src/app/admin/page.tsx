"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Shop } from "@/lib/types/database";

export default function AdminDashboard() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  async function fetchShops() {
    const res = await fetch("/api/admin/shops");
    if (res.ok) {
      setShops(await res.json());
    }
    setLoading(false);
  }

  async function togglePublish(shop: Shop) {
    await fetch(`/api/admin/shops/${shop.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !shop.is_published }),
    });
    fetchShops();
  }

  if (loading) {
    return <p className="text-sm text-jiro-gray">読み込み中...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">店舗一覧</h1>
        <Link
          href="/admin/shops/new"
          className="bg-jiro-dark text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          新規追加
        </Link>
      </div>

      <div className="bg-white border border-jiro-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">店舗名</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                最寄り駅
              </th>
              <th className="text-center px-4 py-3 font-medium w-20">状態</th>
              <th className="text-right px-4 py-3 font-medium w-32">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-jiro-border">
            {shops.map((shop) => (
              <tr key={shop.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/shops/${shop.id}`}
                    className="font-medium hover:text-jiro-yellow"
                  >
                    {shop.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-jiro-gray hidden sm:table-cell">
                  {shop.nearest_station}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => togglePublish(shop)}
                    className={`text-xs px-2 py-1 rounded ${
                      shop.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-jiro-gray"
                    }`}
                  >
                    {shop.is_published ? "公開" : "非公開"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <Link
                      href={`/admin/shops/${shop.id}/menu`}
                      className="text-xs text-jiro-gray hover:text-jiro-dark"
                    >
                      メニュー
                    </Link>
                    <Link
                      href={`/admin/shops/${shop.id}/flow`}
                      className="text-xs text-jiro-gray hover:text-jiro-dark"
                    >
                      フロー
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {shops.length === 0 && (
          <p className="text-center text-jiro-gray py-8">
            店舗が登録されていません
          </p>
        )}
      </div>
    </div>
  );
}
