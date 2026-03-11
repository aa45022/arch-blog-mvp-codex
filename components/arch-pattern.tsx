/**
 * 建築紋理 SVG — 無封面圖時的預設背景
 * 6 種不同的幾何圖案，基於 seed 決定顯示哪一種
 */

type ArchPatternProps = {
  index: number;
  className?: string;
};

const patterns = [
  // 0: 網格 — 結構圖面感
  (dark: boolean) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={dark ? "#262626" : "#e5e5e5"} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={dark ? "#141414" : "#f5f5f5"} />
      <rect width="100%" height="100%" fill="url(#grid)" />
      <line x1="0" y1="50%" x2="100%" y2="50%" stroke={dark ? "#333" : "#d4d4d4"} strokeWidth="0.5" />
      <line x1="50%" y1="0" x2="50%" y2="100%" stroke={dark ? "#333" : "#d4d4d4"} strokeWidth="0.5" />
    </svg>
  ),
  // 1: 對角線 — 剖面圖感
  (dark: boolean) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diag" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="20" stroke={dark ? "#262626" : "#e5e5e5"} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={dark ? "#141414" : "#f5f5f5"} />
      <rect width="100%" height="100%" fill="url(#diag)" />
    </svg>
  ),
  // 2: 同心矩形 — 平面圖感
  (dark: boolean) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill={dark ? "#141414" : "#f5f5f5"} />
      {[90, 75, 60, 45, 30, 15].map((s, i) => (
        <rect key={i} x={`${(100 - s) / 2}%`} y={`${(100 - s) / 2}%`} width={`${s}%`} height={`${s}%`}
          fill="none" stroke={dark ? "#262626" : "#e5e5e5"} strokeWidth="0.5" />
      ))}
    </svg>
  ),
  // 3: 點陣 — 量化分析感
  (dark: boolean) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1" fill={dark ? "#333" : "#d4d4d4"} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={dark ? "#141414" : "#f5f5f5"} />
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  ),
  // 4: 磚砌 — 構造感
  (dark: boolean) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="brick" width="60" height="30" patternUnits="userSpaceOnUse">
          <rect width="60" height="30" fill="none" stroke={dark ? "#262626" : "#e5e5e5"} strokeWidth="0.5" />
          <line x1="30" y1="0" x2="30" y2="15" stroke={dark ? "#262626" : "#e5e5e5"} strokeWidth="0.5" />
          <line x1="0" y1="15" x2="60" y2="15" stroke={dark ? "#262626" : "#e5e5e5"} strokeWidth="0.5" />
          <line x1="0" y1="15" x2="0" y2="30" stroke={dark ? "#262626" : "#e5e5e5"} strokeWidth="0.5" />
          <line x1="60" y1="15" x2="60" y2="30" stroke={dark ? "#262626" : "#e5e5e5"} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={dark ? "#141414" : "#f5f5f5"} />
      <rect width="100%" height="100%" fill="url(#brick)" />
    </svg>
  ),
  // 5: 等高線 — 地形圖感
  (dark: boolean) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="250" fill={dark ? "#141414" : "#f5f5f5"} />
      {[120, 100, 80, 60, 40, 20].map((r, i) => (
        <ellipse key={i} cx="200" cy="130" rx={r * 1.6} ry={r}
          fill="none" stroke={dark ? "#262626" : "#e5e5e5"} strokeWidth="0.5" />
      ))}
    </svg>
  ),
];

export default function ArchPattern({ index, className = "" }: ArchPatternProps) {
  const safeIndex = Math.abs(index) % patterns.length;

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* 淺色模式 */}
      <div className="absolute inset-0 dark:hidden">
        {patterns[safeIndex](false)}
      </div>
      {/* 深色模式 */}
      <div className="absolute inset-0 hidden dark:block">
        {patterns[safeIndex](true)}
      </div>
    </div>
  );
}
