import type { Topping } from "@/lib/types/database";
import { ReportButton } from "@/components/report/ReportButton";

export function ToppingGuide({ toppings }: { toppings: Topping[] }) {
  if (toppings.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-4">コール方法</h3>
      <div className="p-4 bg-gray-50 rounded-lg mb-4 text-sm space-y-2">
        <p>
          麺の茹で上がり直前に、店員さんから
          <span className="font-medium">「○○の方、ニンニク入れますか？」</span>
          と声がかかります。
        </p>
        <p className="text-jiro-gray">
          ※ 注文したメニューのサイズ（「小の方」「大の方」など）や、
          座っている位置・目線で呼ばれることが多いです。
          自分のことだと思ったら答えましょう。
        </p>
      </div>
      <div className="space-y-4">
        {toppings.map((topping) => (
          <div
            key={topping.id}
            className="border border-jiro-border rounded-lg p-4 relative"
          >
            <div className="absolute top-2 right-2">
              <ReportButton
                page="menu"
                targetKind="topping"
                targetId={topping.id}
                targetLabel={topping.name}
              />
            </div>
            <div className="font-medium mb-2 pr-8">{topping.name}</div>
            <div className="flex flex-wrap gap-2">
              {topping.options.map((option) => {
                const isDefault = option === topping.default_option;
                return (
                  <span
                    key={option}
                    className={`text-sm px-3 py-1.5 rounded-full border ${
                      isDefault
                        ? "bg-jiro-yellow-light border-jiro-yellow font-medium"
                        : "border-jiro-border text-jiro-gray"
                    }`}
                  >
                    {option}
                    {isDefault && (
                      <span className="text-xs ml-1">(標準)</span>
                    )}
                  </span>
                );
              })}
            </div>
            {topping.description && (
              <p className="text-xs text-jiro-gray mt-2">
                {topping.description}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-jiro-yellow-light rounded-lg">
        <p className="text-sm">
          <span className="font-medium">初めての方へ:</span>{" "}
          何も追加しない場合は「そのままで」と伝えればOKです。
        </p>
      </div>
    </div>
  );
}
