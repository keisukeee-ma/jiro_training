"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ReportPage, ReportTargetKind } from "@/lib/types/database";
import { ReportModal } from "./ReportModal";
import { TextSelectionReporter } from "./TextSelectionReporter";

export type ReportTarget = {
  page: ReportPage;
  targetKind: ReportTargetKind;
  targetId?: string | null;
  targetLabel: string;
};

type ReportContextValue = {
  shopId: string;
  openReport: (target: ReportTarget) => void;
};

const ReportCtx = createContext<ReportContextValue | null>(null);

export function useReport() {
  const ctx = useContext(ReportCtx);
  if (!ctx) throw new Error("useReport must be used within <ReportProvider>");
  return ctx;
}

export function ReportProvider({
  shopId,
  defaultPage = "info",
  children,
}: {
  shopId: string;
  defaultPage?: ReportPage;
  children: ReactNode;
}) {
  const [target, setTarget] = useState<ReportTarget | null>(null);

  const openReport = useCallback((t: ReportTarget) => {
    setTarget(t);
  }, []);

  const close = useCallback(() => setTarget(null), []);

  const value = useMemo(
    () => ({ shopId, openReport }),
    [shopId, openReport]
  );

  return (
    <ReportCtx.Provider value={value}>
      {children}
      <ReportModal
        shopId={shopId}
        target={target}
        onClose={close}
      />
      <TextSelectionReporter defaultPage={defaultPage} />
    </ReportCtx.Provider>
  );
}
