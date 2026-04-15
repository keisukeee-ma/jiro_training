"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { VisitStep } from "@/lib/types/database";

export default function AdminFlowPage() {
  const params = useParams();
  const shopId = params.id as string;
  const [steps, setSteps] = useState<VisitStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/shops/${shopId}/flow`)
      .then((r) => r.json())
      .then((data) => {
        setSteps(data);
        setLoading(false);
      });
  }, [shopId]);

  async function addStep() {
    const nextNumber = steps.length > 0 ? Math.max(...steps.map((s) => s.step_number)) + 1 : 1;
    const res = await fetch(`/api/admin/shops/${shopId}/flow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        step_number: nextNumber,
        title: "新しいステップ",
        description: "ステップの説明を入力してください",
      }),
    });
    if (res.ok) {
      const step = await res.json();
      setSteps([...steps, step]);
    }
  }

  async function updateStep(step: VisitStep) {
    await fetch(`/api/admin/shops/${shopId}/flow`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(step),
    });
  }

  async function deleteStep(stepId: string) {
    await fetch(`/api/admin/shops/${shopId}/flow`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: stepId }),
    });
    setSteps(steps.filter((s) => s.id !== stepId));
  }

  async function moveStep(index: number, direction: "up" | "down") {
    const newSteps = [...steps];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSteps.length) return;

    const tempNumber = newSteps[index].step_number;
    newSteps[index].step_number = newSteps[swapIndex].step_number;
    newSteps[swapIndex].step_number = tempNumber;

    await Promise.all([
      updateStep(newSteps[index]),
      updateStep(newSteps[swapIndex]),
    ]);

    newSteps.sort((a, b) => a.step_number - b.step_number);
    setSteps(newSteps);
  }

  if (loading) return <p className="text-sm text-jiro-gray">読み込み中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">来店フロー編集</h1>
        <a
          href={`/admin/shops/${shopId}`}
          className="text-sm text-jiro-gray hover:text-jiro-dark"
        >
          店舗編集に戻る
        </a>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={addStep}
          className="bg-jiro-dark text-white rounded-lg px-3 py-1.5 text-sm hover:bg-gray-800"
        >
          ステップ追加
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="bg-white border border-jiro-border rounded-lg p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 bg-jiro-yellow rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {step.step_number}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => moveStep(index, "up")}
                  disabled={index === 0}
                  className="text-xs px-2 py-1 border border-jiro-border rounded hover:bg-gray-50 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveStep(index, "down")}
                  disabled={index === steps.length - 1}
                  className="text-xs px-2 py-1 border border-jiro-border rounded hover:bg-gray-50 disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <button
                onClick={() => deleteStep(step.id)}
                className="ml-auto text-sm text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-jiro-gray">タイトル</label>
                <input
                  defaultValue={step.title}
                  onBlur={(e) =>
                    updateStep({ ...step, title: e.target.value })
                  }
                  className="w-full border border-jiro-border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-jiro-gray">説明</label>
                <textarea
                  defaultValue={step.description}
                  rows={2}
                  onBlur={(e) =>
                    updateStep({ ...step, description: e.target.value })
                  }
                  className="w-full border border-jiro-border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-jiro-gray">Tips（任意）</label>
                <input
                  defaultValue={step.tips ?? ""}
                  onBlur={(e) =>
                    updateStep({ ...step, tips: e.target.value || null })
                  }
                  className="w-full border border-jiro-border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {steps.length === 0 && (
        <p className="text-center text-jiro-gray py-8">
          フローが登録されていません。「ステップ追加」で追加してください。
        </p>
      )}
    </div>
  );
}
