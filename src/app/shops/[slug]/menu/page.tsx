import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ShopTabs } from "@/components/shop/ShopTabs";
import { MenuTable } from "@/components/menu/MenuTable";
import { ToppingGuide } from "@/components/menu/ToppingGuide";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { ReportProvider } from "@/components/report/ReportContext";

export const revalidate = 60;

export default async function MenuPage({
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

  const [{ data: menuItems }, { data: toppings }] = await Promise.all([
    supabase
      .from("menu_items")
      .select("*")
      .eq("shop_id", shop.id)
      .order("sort_order"),
    supabase
      .from("toppings")
      .select("*")
      .eq("shop_id", shop.id)
      .order("sort_order"),
  ]);

  return (
    <ReportProvider shopId={shop.id} defaultPage="menu">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "トップ", href: "/" },
            { label: shop.name, href: `/shops/${slug}` },
            { label: "メニュー" },
          ]}
        />
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{shop.name}</h1>
        <ShopTabs slug={slug} />
        <h2 className="font-bold text-lg mb-4">メニュー</h2>
        <MenuTable items={menuItems ?? []} />
        <ToppingGuide toppings={toppings ?? []} />
      </div>
    </ReportProvider>
  );
}
