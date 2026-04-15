import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ShopTabs } from "@/components/shop/ShopTabs";
import { ShopInfo } from "@/components/shop/ShopInfo";
import { ShopCommentForm } from "@/components/shop/ShopCommentForm";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { ReportProvider } from "@/components/report/ReportContext";

export const revalidate = 60;

export async function generateStaticParams() {
  const { data: shops } = await supabase.from("shops").select("slug");
  return shops?.map((shop) => ({ slug: shop.slug })) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: shop } = await supabase
    .from("shops")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!shop) return {};

  const title = `${shop.name} - 二郎マップ`;
  const description =
    shop.description ?? `${shop.name}の基本情報・メニュー・来店フローをまとめています。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!shop) notFound();

  return (
    <ReportProvider shopId={shop.id} defaultPage="info">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "トップ", href: "/" },
            { label: shop.name },
          ]}
        />
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{shop.name}</h1>
        <ShopTabs slug={slug} />
        <ShopInfo shop={shop} />
        <ShopCommentForm shopId={shop.id} />
      </div>
    </ReportProvider>
  );
}
