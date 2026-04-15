import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ShopTabs } from "@/components/shop/ShopTabs";
import { FlowSteps } from "@/components/flow/FlowSteps";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { ReportProvider } from "@/components/report/ReportContext";

export const revalidate = 60;

export default async function FlowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: shop } = await supabase
    .from("shops")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (!shop) notFound();

  const { data: steps } = await supabase
    .from("visit_steps")
    .select("*")
    .eq("shop_id", shop.id)
    .order("step_number");

  return (
    <ReportProvider shopId={shop.id} defaultPage="flow">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "トップ", href: "/" },
            { label: shop.name, href: `/shops/${slug}` },
            { label: "来店フロー" },
          ]}
        />
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{shop.name}</h1>
        <ShopTabs slug={slug} />
        <h2 className="font-bold text-lg mb-4">来店〜退店の流れ</h2>
        <FlowSteps steps={steps ?? []} />
      </div>
    </ReportProvider>
  );
}
