"use client";

import type { VisitStep } from "@/lib/types/database";
import { getStepIcon } from "./FlowIcons";
import { ReportButton } from "@/components/report/ReportButton";

export function FlowSteps({ steps }: { steps: VisitStep[] }) {
  if (steps.length === 0) {
    return (
      <p className="text-sm text-jiro-gray">
        来店フローはまだ登録されていません。
      </p>
    );
  }

  return (
    <div className="relative">
      {/* タイムラインのライン */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-jiro-border" />

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative flex gap-4 animate-fade-in"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            {/* ステップ番号 */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-jiro-yellow flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-sm font-bold text-jiro-dark">
                {step.step_number}
              </span>
            </div>

            {/* コンテンツ */}
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-base">{step.title}</h3>
                <ReportButton
                  page="flow"
                  targetKind="visit_step"
                  targetId={step.id}
                  targetLabel={`Step${step.step_number} ${step.title}`}
                  className="shrink-0 -mt-1 -mr-1"
                />
              </div>

              {/* イラスト */}
              <div className="mt-3 w-full max-w-[240px] aspect-[2/1] min-h-[110px] bg-gray-50 rounded-lg border border-jiro-border p-3 flex items-center justify-center">
                {getStepIcon(step.title)}
              </div>

              <p className="text-sm text-jiro-gray mt-3">{step.description}</p>
              {step.tips && (
                <div className="mt-2 p-2.5 bg-jiro-yellow-light rounded text-sm">
                  <span className="font-medium">ポイント:</span> {step.tips}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
