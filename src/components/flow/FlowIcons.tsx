export function getStepIcon(title: string): React.ReactNode {
  const lower = title.toLowerCase();

  // 並ぶ
  if (lower.includes("並ぶ") || lower.includes("列")) {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* 3人が並んでいる */}
        <circle cx="12" cy="14" r="4" fill="#f5c518" />
        <path d="M6 30c0-4 3-7 6-7s6 3 6 7" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <circle cx="24" cy="14" r="4" fill="#f5c518" opacity="0.7" />
        <path d="M18 30c0-4 3-7 6-7s6 3 6 7" stroke="#1a1a1a" strokeWidth="2" fill="none" opacity="0.7" />
        <circle cx="36" cy="14" r="4" fill="#f5c518" opacity="0.4" />
        <path d="M30 30c0-4 3-7 6-7s6 3 6 7" stroke="#1a1a1a" strokeWidth="2" fill="none" opacity="0.4" />
        {/* 矢印 */}
        <path d="M8 38h32M36 34l4 4-4 4" stroke="#6b7280" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  // 食券を見せる（「食券を購入」「カウンターに置く」より先に判定）
  if (lower.includes("食券") && lower.includes("見せる")) {
    return (
      <svg viewBox="0 0 56 48" fill="none" className="w-full h-full">
        {/* 店員（左側） */}
        <circle cx="10" cy="14" r="4" fill="#1a1a1a" />
        <path d="M4 30c0-4 3-7 6-7s6 3 6 7" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        {/* 店員の手（右に伸ばして受け取る） */}
        <path d="M14 24 L20 22" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />

        {/* お客さん（右側） */}
        <circle cx="46" cy="14" r="4" fill="#f5c518" />
        <path d="M40 30c0-4 3-7 6-7s6 3 6 7" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        {/* お客さんの手（左に伸ばして差し出す） */}
        <path d="M42 24 L36 22" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />

        {/* 食券（中央・差し出されている） */}
        <g>
          <rect x="22" y="18" width="12" height="7" rx="1" fill="#f5c518" stroke="#e0a800" strokeWidth="0.8">
            <animate attributeName="x" values="24;22;24" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <text x="28" y="23" textAnchor="middle" fontSize="3.2" fill="#1a1a1a" fontWeight="bold">
            食券
            <animate attributeName="x" values="30;28;30" dur="1.5s" repeatCount="indefinite" />
          </text>
        </g>

        {/* きらっと光るエフェクト */}
        <g>
          <circle cx="28" cy="16" r="1" fill="#fef9e7">
            <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="32" cy="28" r="0.8" fill="#fef9e7">
            <animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    );
  }

  // 食券をカウンターに（「食券を購入」より先に判定）
  if (lower.includes("カウンター") && lower.includes("食券")) {
    return (
      <svg viewBox="0 0 56 48" fill="none" className="w-full h-full">
        {/* カウンター（横から見た図） */}
        <rect x="4" y="24" width="48" height="3" rx="1" fill="#b0946a" />
        <rect x="4" y="22" width="48" height="2" rx="0.5" fill="#d4c5a9" />

        {/* 丼（奥側、隣の人のもの） */}
        <ellipse cx="14" cy="20" rx="5" ry="2" fill="none" stroke="#d4c5a9" strokeWidth="0.8" />
        <ellipse cx="42" cy="20" rx="5" ry="2" fill="none" stroke="#d4c5a9" strokeWidth="0.8" />

        {/* 食券（手で置くアニメーション） */}
        <g>
          <rect x="23" y="14" width="10" height="6" rx="1" fill="#f5c518" stroke="#e0a800" strokeWidth="0.8">
            <animate attributeName="y" values="8;14" dur="0.8s" begin="0.3s" fill="freeze" />
          </rect>
          <text x="28" y="18.5" textAnchor="middle" fontSize="3" fill="#1a1a1a" fontWeight="bold">
            食券
            <animate attributeName="y" values="12.5;18.5" dur="0.8s" begin="0.3s" fill="freeze" />
          </text>
        </g>

        {/* 手（下から食券を置く） */}
        <path d="M28 38 L28 32 C28 30 26 29 25 30 L23 32 M28 32 C28 30 30 29 31 30 L33 32" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="1;1;0.3" dur="1.2s" begin="0.3s" fill="freeze" />
        </path>

        {/* 置く方向の矢印 */}
        <path d="M28 11 L28 6" stroke="#b0946a" strokeWidth="1" fill="none">
          <animate attributeName="opacity" values="1;0" dur="0.8s" begin="0.3s" fill="freeze" />
        </path>
        <path d="M26.5 7.5 L28 5.5 L29.5 7.5" stroke="#b0946a" strokeWidth="1" fill="none">
          <animate attributeName="opacity" values="1;0" dur="0.8s" begin="0.3s" fill="freeze" />
        </path>
      </svg>
    );
  }

  // 食券を購入
  if (lower.includes("食券") || lower.includes("券売")) {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* 券売機 */}
        <rect x="10" y="6" width="28" height="36" rx="3" stroke="#1a1a1a" strokeWidth="2" fill="#fef9e7" />
        {/* 画面 */}
        <rect x="14" y="10" width="20" height="10" rx="1" fill="#f5c518" opacity="0.3" />
        {/* ボタン列 */}
        <rect x="14" y="24" width="8" height="4" rx="1" fill="#f5c518" />
        <rect x="26" y="24" width="8" height="4" rx="1" fill="#e5e7eb" />
        <rect x="14" y="31" width="8" height="4" rx="1" fill="#e5e7eb" />
        <rect x="26" y="31" width="8" height="4" rx="1" fill="#e5e7eb" />
        {/* コイン投入口 */}
        <rect x="20" y="38" width="8" height="2" rx="1" fill="#6b7280" />
      </svg>
    );
  }

  // 席
  if (lower.includes("席") || lower.includes("着席") || lower.includes("座る")) {
    return (
      <svg viewBox="0 0 72 62" fill="none" className="w-full h-full">
        {/* === 三田本店 L字カウンター レイアウト図 === */}

        {/* L字カウンター本体 */}
        {/* 縦部分（左側） */}
        <path d="M16 6 L16 30" stroke="#b0946a" strokeWidth="2.5" fill="none" />
        {/* 横部分（下側）: 左端からL字で右へ */}
        <path d="M16 30 L58 30" stroke="#b0946a" strokeWidth="2.5" fill="none" />
        {/* 右上の短いカウンター */}
        <path d="M58 30 L58 18" stroke="#b0946a" strokeWidth="2.5" fill="none" />
        {/* 上部の横線（厨房の奥壁） */}
        <path d="M16 6 L58 6" stroke="#d4c5a9" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M58 6 L58 18" stroke="#d4c5a9" strokeWidth="1" strokeDasharray="2 2" />

        {/* 厨房ラベル */}
        <text x="37" y="19" textAnchor="middle" fontSize="4" fill="#b0946a" fontWeight="500">厨房</text>

        {/* 左縦カウンター席 (4席) - カウンター左外側 */}
        {[0,1,2,3].map((i) => (
          <g key={`v${i}`}>
            <circle cx={9} cy={10 + i * 5.5} r={2.2} fill="#e8e0d0" stroke="#d4c5a9" strokeWidth="0.8" />
          </g>
        ))}

        {/* 下横カウンター席 (7席) - カウンター下外側 */}
        {[0,1,2,3,4,5,6].map((i) => (
          <g key={`h${i}`}>
            <circle cx={20 + i * 5.2} cy={37} r={2.2} fill="#e8e0d0" stroke="#d4c5a9" strokeWidth="0.8" />
          </g>
        ))}

        {/* 右上カウンター席 (2席) - カウンター右外側 */}
        {[0,1].map((i) => (
          <g key={`r${i}`}>
            <circle cx={64} cy={20 + i * 5.5} r={2.2} fill="#e8e0d0" stroke="#d4c5a9" strokeWidth="0.8" />
          </g>
        ))}

        {/* 入口（左） */}
        <text x="18" y="44" fontSize="3.2" fill="#8c7a5e">入口</text>
        {/* 入口（右） */}
        <text x="47" y="44" fontSize="3.2" fill="#8c7a5e">入口</text>

        {/* 並びの列（入口の下） */}
        {[0,1,2,3,4,5,6,7].map((i) => (
          <g key={`q${i}`}>
            <circle cx={16 + i * 5.2} cy={52} r={2.2} fill="#fef3c7" stroke="#f5c518" strokeWidth="0.8" />
          </g>
        ))}
        {/* 並び矢印 */}
        <path d="M56 58 L16 58" stroke="#d4c5a9" strokeWidth="1.2" fill="none" />
        <path d="M20 56 L16 58 L20 60" stroke="#d4c5a9" strokeWidth="1.2" fill="none" />
        <text x="36" y="61.5" textAnchor="middle" fontSize="3" fill="#8c7a5e">並び</text>
      </svg>
    );
  }


  // コール
  if (lower.includes("コール") || lower.includes("ニンニク")) {
    return (
      <svg viewBox="0 0 56 48" fill="none" className="w-full h-full">
        {/* 店員 */}
        <circle cx="10" cy="14" r="4" fill="#1a1a1a" />
        <path d="M4 30c0-4 3-7 6-7s6 3 6 7" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        {/* 口の動き */}
        <ellipse cx="10" cy="20" rx="1.5" ry="1" fill="#1a1a1a">
          <animate attributeName="ry" values="1;2;0.5;1.8;1" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        {/* 吹き出し - 楕円形・アニメーション付き */}
        <g>
          <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.3s" fill="freeze" />
          {/* 楕円形の吹き出し */}
          <ellipse cx="36" cy="14" rx="16" ry="10" fill="#fef9e7" stroke="#f5c518" strokeWidth="1.5" />
          {/* 吹き出しのしっぽ */}
          <path d="M22 18l-3 5 6-2" fill="#fef9e7" stroke="#fef9e7" strokeWidth="1" />
          <path d="M22 18l-3 5" stroke="#f5c518" strokeWidth="1.5" fill="none" />
          <text x="36" y="12" textAnchor="middle" fontSize="4.5" fill="#6b7280">
            ニンニク
            <animate attributeName="opacity" values="0;0;1" dur="0.8s" begin="0.5s" fill="freeze" />
          </text>
          <text x="36" y="18" textAnchor="middle" fontSize="5" fill="#1a1a1a" fontWeight="bold">
            入れますか?
            <animate attributeName="opacity" values="0;0;1" dur="0.8s" begin="0.8s" fill="freeze" />
          </text>
        </g>
        {/* お客さん */}
        <circle cx="42" cy="32" r="3" fill="#f5c518" />
        <path d="M37 44c0-3 2-6 5-6s5 3 5 6" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
        {/* お客さんの「?」リアクション */}
        <text x="48" y="30" fontSize="6" fill="#f5c518" fontWeight="bold">
          ?
          <animate attributeName="opacity" values="0;0;1;1;0;1" dur="2s" begin="1.2s" repeatCount="indefinite" />
        </text>
      </svg>
    );
  }

  // 食べる
  if (lower.includes("食べる") || lower.includes("食事")) {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* 丼 */}
        <ellipse cx="24" cy="28" rx="14" ry="4" fill="#fef9e7" stroke="#1a1a1a" strokeWidth="1.5" />
        <path d="M10 28c0 6 6 10 14 10s14-4 14-10" stroke="#1a1a1a" strokeWidth="1.5" fill="#fef9e7" />
        {/* 麺（波線） */}
        <path d="M16 26c2-2 4 0 6-2s4 0 6-2" stroke="#f5c518" strokeWidth="1.5" fill="none" />
        <path d="M14 24c2-2 4 0 6-2s4 0 6-2s4 0 6-2" stroke="#f5c518" strokeWidth="1" fill="none" opacity="0.5" />
        {/* 湯気 */}
        <path d="M18 18c0-3 2-4 2-6" stroke="#6b7280" strokeWidth="1" opacity="0.5" />
        <path d="M24 16c0-3 2-4 2-6" stroke="#6b7280" strokeWidth="1" opacity="0.5" />
        <path d="M30 18c0-3 2-4 2-6" stroke="#6b7280" strokeWidth="1" opacity="0.5" />
        {/* 箸 */}
        <line x1="20" y1="8" x2="26" y2="24" stroke="#1a1a1a" strokeWidth="1.5" />
        <line x1="22" y1="8" x2="28" y2="24" stroke="#1a1a1a" strokeWidth="1.5" />
      </svg>
    );
  }

  // 退店・丼を上げる
  if (lower.includes("退店") || lower.includes("丼")) {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* カウンター */}
        <rect x="4" y="22" width="40" height="3" rx="1" fill="#1a1a1a" />
        {/* 丼（上に上げる動き） */}
        <ellipse cx="20" cy="16" rx="8" ry="3" fill="#fef9e7" stroke="#1a1a1a" strokeWidth="1" />
        <path d="M12 16c0 4 4 6 8 6s8-2 8-6" stroke="#1a1a1a" strokeWidth="1" fill="#fef9e7" />
        {/* 上矢印 */}
        <path d="M20 10l0-5M17 7l3-3 3 3" stroke="#f5c518" strokeWidth="1.5" fill="none" />
        {/* 布巾 */}
        <rect x="32" y="14" width="8" height="6" rx="1" fill="#f5c518" opacity="0.3" stroke="#f5c518" strokeWidth="1" />
        <path d="M34 17h4" stroke="#f5c518" strokeWidth="0.5" />
        {/* 出口 */}
        <path d="M38 32h4v10h-4" stroke="#6b7280" strokeWidth="1.5" fill="none" />
        <path d="M36 37l4 0M38 35l2 2-2 2" stroke="#6b7280" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  // デフォルト
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="16" fill="#fef9e7" stroke="#f5c518" strokeWidth="2" />
      <circle cx="24" cy="24" r="4" fill="#f5c518" />
    </svg>
  );
}
