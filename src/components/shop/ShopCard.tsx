import Link from "next/link";
import type { Shop } from "@/lib/types/database";

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link
      href={`/shops/${shop.slug}`}
      className="block border border-jiro-border rounded-lg p-4 hover:border-jiro-yellow transition-colors"
    >
      <h2 className="font-bold text-lg">{shop.name}</h2>
      {shop.business_hours && (
        <p className="text-sm mt-2">{shop.business_hours}</p>
      )}
      {shop.closed_days && (
        <p className="text-sm text-jiro-gray">定休日: {shop.closed_days}</p>
      )}
      {shop.description && (
        <p className="text-sm text-jiro-gray mt-2 line-clamp-2">
          {shop.description}
        </p>
      )}
    </Link>
  );
}
