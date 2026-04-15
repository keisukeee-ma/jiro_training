import { supabase } from "@/lib/supabase/client";
import { ShopCard } from "@/components/shop/ShopCard";

export const revalidate = 60;

export default async function HomePage() {
  const { data: shops } = await supabase
    .from("shops")
    .select("*")
    .order("name");

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <section className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">ラーメン二郎 店舗ガイド</h1>
        <p className="text-sm sm:text-base text-jiro-gray mt-2 px-2">
          初めての店舗でも迷わない。各店舗のルール・メニュー・来店フローをまとめました。
        </p>
      </section>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {shops?.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>

      {(!shops || shops.length === 0) && (
        <p className="text-center text-jiro-gray py-12">
          店舗情報はまだ登録されていません。
        </p>
      )}
    </div>
  );
}
