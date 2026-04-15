"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { MenuItem, Topping } from "@/lib/types/database";

export default function AdminMenuPage() {
  const params = useParams();
  const shopId = params.id as string;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/shops/${shopId}/menu`).then((r) => r.json()),
      fetch(`/api/admin/shops/${shopId}/toppings`).then((r) => r.json()),
    ]).then(([m, t]) => {
      setMenuItems(m);
      setToppings(t);
      setLoading(false);
    });
  }, [shopId]);

  async function addMenuItem() {
    const res = await fetch(`/api/admin/shops/${shopId}/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "新しいメニュー",
        price: 0,
        sort_order: menuItems.length + 1,
      }),
    });
    if (res.ok) {
      const item = await res.json();
      setMenuItems([...menuItems, item]);
    }
  }

  async function updateMenuItem(item: MenuItem) {
    await fetch(`/api/admin/shops/${shopId}/menu`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  }

  async function deleteMenuItem(itemId: string) {
    await fetch(`/api/admin/shops/${shopId}/menu`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: itemId }),
    });
    setMenuItems(menuItems.filter((m) => m.id !== itemId));
  }

  async function addTopping() {
    const res = await fetch(`/api/admin/shops/${shopId}/toppings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "新しいトッピング",
        options: ["なし", "普通", "マシ"],
        default_option: "普通",
        sort_order: toppings.length + 1,
      }),
    });
    if (res.ok) {
      const item = await res.json();
      setToppings([...toppings, item]);
    }
  }

  async function updateTopping(item: Topping) {
    await fetch(`/api/admin/shops/${shopId}/toppings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  }

  async function deleteTopping(itemId: string) {
    await fetch(`/api/admin/shops/${shopId}/toppings`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: itemId }),
    });
    setToppings(toppings.filter((t) => t.id !== itemId));
  }

  if (loading) return <p className="text-sm text-jiro-gray">読み込み中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">メニュー編集</h1>
        <a
          href={`/admin/shops/${shopId}`}
          className="text-sm text-jiro-gray hover:text-jiro-dark"
        >
          店舗編集に戻る
        </a>
      </div>

      {/* メニュー一覧 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">メニュー項目</h2>
          <button
            onClick={addMenuItem}
            className="bg-jiro-dark text-white rounded-lg px-3 py-1.5 text-sm hover:bg-gray-800"
          >
            追加
          </button>
        </div>
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-jiro-border rounded-lg p-4 flex flex-wrap gap-3 items-end"
            >
              <div className="flex-1 min-w-[150px]">
                <label className="text-xs text-jiro-gray">メニュー名</label>
                <input
                  defaultValue={item.name}
                  onBlur={(e) =>
                    updateMenuItem({ ...item, name: e.target.value })
                  }
                  className="w-full border border-jiro-border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="w-24">
                <label className="text-xs text-jiro-gray">価格</label>
                <input
                  type="number"
                  defaultValue={item.price}
                  onBlur={(e) =>
                    updateMenuItem({ ...item, price: Number(e.target.value) })
                  }
                  className="w-full border border-jiro-border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="w-20">
                <label className="text-xs text-jiro-gray">サイズ</label>
                <input
                  defaultValue={item.size ?? ""}
                  onBlur={(e) =>
                    updateMenuItem({ ...item, size: e.target.value || null })
                  }
                  className="w-full border border-jiro-border rounded px-2 py-1 text-sm"
                />
              </div>
              <button
                onClick={() => deleteMenuItem(item.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* トッピング一覧 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">トッピング（コール）</h2>
          <button
            onClick={addTopping}
            className="bg-jiro-dark text-white rounded-lg px-3 py-1.5 text-sm hover:bg-gray-800"
          >
            追加
          </button>
        </div>
        <div className="space-y-3">
          {toppings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-jiro-border rounded-lg p-4 space-y-2"
            >
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-xs text-jiro-gray">トッピング名</label>
                  <input
                    defaultValue={item.name}
                    onBlur={(e) =>
                      updateTopping({ ...item, name: e.target.value })
                    }
                    className="w-full border border-jiro-border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-jiro-gray">
                    選択肢（カンマ区切り）
                  </label>
                  <input
                    defaultValue={item.options.join(",")}
                    onBlur={(e) =>
                      updateTopping({
                        ...item,
                        options: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    className="w-full border border-jiro-border rounded px-2 py-1 text-sm"
                  />
                </div>
                <button
                  onClick={() => deleteTopping(item.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
