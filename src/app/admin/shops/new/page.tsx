"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewShopPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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
      is_published: false,
    };

    const res = await fetch("/api/admin/shops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const shop = await res.json();
      router.push(`/admin/shops/${shop.id}`);
    } else {
      alert("保存に失敗しました");
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">新規店舗追加</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <Field label="スラッグ (URL用)" name="slug" required placeholder="例: mita" />
        <Field label="店舗名" name="name" required placeholder="例: ラーメン二郎 三田本店" />
        <Field label="住所" name="address" placeholder="例: 東京都港区三田2-16-4" />
        <Field label="最寄り駅" name="nearest_station" placeholder="例: JR田町駅" />
        <Field label="営業時間" name="business_hours" placeholder="例: 月〜土 8:30〜15:00" />
        <Field label="定休日" name="closed_days" placeholder="例: 日曜・祝日" />
        <Field label="SNS URL" name="sns" placeholder="例: https://x.com/xxxxx" />
        <Field label="席数" name="seat_count" type="number" placeholder="例: 13" />
        <div>
          <label className="block text-sm font-medium mb-1">店舗の特徴</label>
          <textarea
            name="description"
            rows={3}
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
            onClick={() => router.back()}
            className="border border-jiro-border rounded-lg px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            キャンセル
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
