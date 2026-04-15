"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Shop } from "@/lib/types/database";

export default function EditShopPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [shop, setShop] = useState<Shop | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/shops/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setShop(data);
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const body = {
      slug: form.get("slug"),
      name: form.get("name"),
      address: form.get("address") || null,
      nearest_station: form.get("nearest_station") || null,
      business_hours: form.get("business_hours") || null,
      closed_days: form.get("closed_days") || null,
      sns: form.get("sns") || null,
      description: form.get("description") || null,
      seat_count: form.get("seat_count")
        ? Number(form.get("seat_count"))
        : null,
    };

    const res = await fetch(`/api/admin/shops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("保存しました");
    } else {
      alert("保存に失敗しました");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("この店舗を削除しますか？関連データも全て削除されます。")) return;
    await fetch(`/api/admin/shops/${id}`, { method: "DELETE" });
    router.push("/admin");
  }

  if (loading) return <p className="text-sm text-jiro-gray">読み込み中...</p>;
  if (!shop) return <p className="text-sm text-red-600">店舗が見つかりません</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">店舗編集</h1>
        <div className="flex gap-2">
          <a
            href={`/admin/shops/${id}/menu`}
            className="border border-jiro-border rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            メニュー編集
          </a>
          <a
            href={`/admin/shops/${id}/flow`}
            className="border border-jiro-border rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            フロー編集
          </a>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <Field label="スラッグ (URL用)" name="slug" required defaultValue={shop.slug} />
        <Field label="店舗名" name="name" required defaultValue={shop.name} />
        <Field label="住所" name="address" defaultValue={shop.address ?? ""} />
        <Field label="最寄り駅" name="nearest_station" defaultValue={shop.nearest_station ?? ""} />
        <Field label="営業時間" name="business_hours" defaultValue={shop.business_hours ?? ""} />
        <Field label="定休日" name="closed_days" defaultValue={shop.closed_days ?? ""} />
        <Field label="SNS URL" name="sns" placeholder="例: https://x.com/xxxxx" defaultValue={shop.sns ?? ""} />
        <Field label="席数" name="seat_count" type="number" defaultValue={shop.seat_count?.toString() ?? ""} />
        <div>
          <label className="block text-sm font-medium mb-1">店舗の特徴</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={shop.description ?? ""}
            className="w-full border border-jiro-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jiro-yellow"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-jiro-dark text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="border border-jiro-border rounded-lg px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            戻る
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto text-sm text-red-600 hover:text-red-800"
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full border border-jiro-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jiro-yellow"
      />
    </div>
  );
}
