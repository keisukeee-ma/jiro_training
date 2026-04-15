import type { MenuItem } from "@/lib/types/database";
import { ReportButton } from "@/components/report/ReportButton";

export function MenuTable({ items }: { items: MenuItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-jiro-gray">
        メニュー情報はまだ登録されていません。
      </p>
    );
  }

  return (
    <div className="border border-jiro-border rounded-lg overflow-hidden">
      {/* モバイル: カード型リスト */}
      <ul className="divide-y divide-jiro-border sm:hidden">
        {items.map((item) => (
          <li key={item.id} className="px-4 py-3 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium break-words">
                  {item.name}
                </span>
                {item.size && (
                  <span className="text-xs text-jiro-gray">({item.size})</span>
                )}
                {item.is_default && (
                  <span className="text-xs bg-jiro-yellow-light text-jiro-dark px-2 py-0.5 rounded">
                    定番
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-jiro-gray mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
            <div className="text-sm font-bold text-jiro-dark whitespace-nowrap shrink-0">
              {item.price.toLocaleString()}円
            </div>
            <ReportButton
              page="menu"
              targetKind="menu_item"
              targetId={item.id}
              targetLabel={item.name}
              className="-mr-1 shrink-0"
            />
          </li>
        ))}
      </ul>

      {/* タブレット以上: テーブル */}
      <table className="w-full text-sm hidden sm:table">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3 font-medium">メニュー</th>
            <th className="text-left px-4 py-3 font-medium w-20">サイズ</th>
            <th className="text-right px-4 py-3 font-medium w-24">価格</th>
            <th className="w-10" aria-label="報告"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-jiro-border">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3">
                <span>{item.name}</span>
                {item.is_default && (
                  <span className="ml-2 text-xs bg-jiro-yellow-light text-jiro-dark px-2 py-0.5 rounded">
                    定番
                  </span>
                )}
                {item.description && (
                  <p className="text-xs text-jiro-gray mt-0.5">
                    {item.description}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 text-jiro-gray">{item.size ?? ""}</td>
              <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                {item.price.toLocaleString()}円
              </td>
              <td className="px-2 py-3 text-right align-middle">
                <ReportButton
                  page="menu"
                  targetKind="menu_item"
                  targetId={item.id}
                  targetLabel={item.name}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
