import type { Shop } from "@/lib/types/database";
import { Reportable } from "@/components/report/Reportable";

type SnsKind = "x" | "instagram" | "facebook" | "link";

function detectSnsKind(url: string): SnsKind {
  const u = url.toLowerCase();
  if (u.includes("x.com") || u.includes("twitter.com")) return "x";
  if (u.includes("instagram.com")) return "instagram";
  if (u.includes("facebook.com")) return "facebook";
  return "link";
}

function SnsIcon({ kind }: { kind: SnsKind }) {
  const common = "w-4 h-4";
  if (kind === "x") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden>
        <path d="M18.244 2H21.5l-7.52 8.59L23 22h-6.91l-4.77-6.24L5.8 22H2.54l8.04-9.18L1.5 2h7.08l4.31 5.7L18.24 2zm-1.21 18h1.84L7.06 4H5.12l11.92 16z" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden>
        <path d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-2 2-2h1.7V2.2C16.4 2.1 15.3 2 14 2c-2.7 0-4.5 1.6-4.5 4.7V10H6v4h3.5v8H13z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" />
      <path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />
    </svg>
  );
}

function snsLabel(kind: SnsKind): string {
  if (kind === "x") return "X (旧Twitter)";
  if (kind === "instagram") return "Instagram";
  if (kind === "facebook") return "Facebook";
  return "公式サイト";
}

export function ShopInfo({ shop }: { shop: Shop }) {
  const items: { label: string; value: string | null; id: string }[] = [
    { label: "住所", value: shop.address, id: "address" },
    { label: "交通手段", value: shop.nearest_station, id: "nearest_station" },
    { label: "営業時間", value: shop.business_hours, id: "business_hours" },
    { label: "定休日", value: shop.closed_days, id: "closed_days" },
    {
      label: "席数",
      value: shop.seat_count ? `${shop.seat_count}席` : null,
      id: "seat_count",
    },
  ];

  const snsKind = shop.sns ? detectSnsKind(shop.sns) : null;

  return (
    <div>
      {shop.description && (
        <Reportable
          page="info"
          targetKind="field"
          targetId="description"
          targetLabel="店舗説明"
          className="mb-6 pr-8"
        >
          <p className="text-sm text-jiro-gray">{shop.description}</p>
        </Reportable>
      )}
      <dl className="divide-y divide-jiro-border">
        {items.map(
          (item) =>
            item.value && (
              <Reportable
                key={item.id}
                page="info"
                targetKind="field"
                targetId={item.id}
                targetLabel={item.label}
                className="py-3 pr-8 flex flex-col sm:flex-row sm:gap-4"
              >
                <dt className="text-sm font-medium text-jiro-gray w-24 shrink-0">
                  {item.label}
                </dt>
                <dd className="text-sm mt-1 sm:mt-0 whitespace-pre-line">
                  {item.value}
                </dd>
              </Reportable>
            )
        )}
        {shop.sns && snsKind && (
          <Reportable
            page="info"
            targetKind="field"
            targetId="sns"
            targetLabel="SNS"
            className="py-3 pr-8 flex flex-col sm:flex-row sm:gap-4"
          >
            <dt className="text-sm font-medium text-jiro-gray w-24 shrink-0">
              SNS
            </dt>
            <dd className="text-sm mt-1 sm:mt-0">
              <a
                href={shop.sns}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-jiro-border rounded-full text-jiro-dark hover:bg-jiro-yellow hover:border-jiro-yellow transition-colors"
              >
                <SnsIcon kind={snsKind} />
                <span>{snsLabel(snsKind)}</span>
              </a>
            </dd>
          </Reportable>
        )}
      </dl>
    </div>
  );
}
