"use client";

/**
 * Абстрактный минималистичный фон для дашборда.
 * S-образная волна, 5 слоёв, мягкие градиенты, свечение и виньетка.
 * Палитра: #062E6E → #0E6FCB → #44B0FF → #CFEAFF → #EAF6FF
 */
export function DashboardBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 2560"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Базовый градиент: тёмный снизу-слева → средний сверху-справа */}
          <linearGradient id="baseGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#062E6E" />
            <stop offset="45%" stopColor="#0A4A9E" />
            <stop offset="100%" stopColor="#0E6FCB" />
          </linearGradient>

          {/* Свечение сверху-справа */}
          <radialGradient id="glowTR" cx="78%" cy="12%" r="55%">
            <stop offset="0%" stopColor="#44B0FF" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#0E6FCB" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0E6FCB" stopOpacity="0" />
          </radialGradient>

          {/* Лёгкое свечение центра */}
          <radialGradient id="glowCenter" cx="60%" cy="45%" r="40%">
            <stop offset="0%" stopColor="#CFEAFF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#CFEAFF" stopOpacity="0" />
          </radialGradient>

          {/* Виньетка */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#021438" stopOpacity="0.55" />
          </radialGradient>

          {/* Мягкое размытие для волн */}
          <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" />
          </filter>

          {/* Сильное размытие для дальних слоёв */}
          <filter id="deepBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="42" />
          </filter>
        </defs>

        {/* Базовый фон */}
        <rect width="1440" height="2560" fill="url(#baseGrad)" />

        {/* ── S-образные волны (5 слоёв) ── */}

        {/* Слой 1 — самый дальний, тёмно-синий, сильно размыт */}
        <path
          d="M 1480 380
             C 1100 520, 900 300, 620 640
             C 340 980, 180 820, -120 1080
             L -120 1380
             C 200 1120, 420 1280, 720 980
             C 1020 680, 1240 820, 1480 680
             Z"
          fill="#062E6E"
          opacity="0.7"
          filter="url(#deepBlur)"
        />

        {/* Слой 2 — средне-синий */}
        <path
          d="M 1480 560
             C 1150 680, 920 500, 680 800
             C 440 1100, 260 980, -80 1220
             L -80 1480
             C 280 1260, 500 1380, 780 1120
             C 1060 860, 1260 960, 1480 840
             Z"
          fill="#0E6FCB"
          opacity="0.45"
          filter="url(#softBlur)"
        />

        {/* Слой 3 — яркий циан, центральная волна */}
        <path
          d="M 1480 780
             C 1180 880, 980 740, 760 1000
             C 540 1260, 360 1160, 40 1360
             L 40 1600
             C 360 1420, 560 1520, 820 1300
             C 1080 1080, 1280 1160, 1480 1060
             Z"
          fill="#44B0FF"
          opacity="0.3"
          filter="url(#softBlur)"
        />

        {/* Слой 4 — светло-голубой, ближе к переднему плану */}
        <path
          d="M 1480 1040
             C 1220 1120, 1040 1020, 840 1220
             C 640 1420, 480 1340, 200 1500
             L 200 1720
             C 480 1580, 660 1660, 880 1480
             C 1100 1300, 1280 1360, 1480 1280
             Z"
          fill="#CFEAFF"
          opacity="0.14"
          filter="url(#softBlur)"
        />

        {/* Слой 5 — почти белый, самый передний, самый мягкий */}
        <path
          d="M 1480 1320
             C 1260 1380, 1100 1310, 920 1460
             C 740 1610, 600 1550, 360 1660
             L 360 1840
             C 600 1740, 760 1790, 940 1660
             C 1120 1530, 1280 1570, 1480 1510
             Z"
          fill="#EAF6FF"
          opacity="0.08"
          filter="url(#softBlur)"
        />

        {/* Свечения поверх волн */}
        <rect width="1440" height="2560" fill="url(#glowTR)" />
        <rect width="1440" height="2560" fill="url(#glowCenter)" />

        {/* Виньетка — затемнение по краям */}
        <rect width="1440" height="2560" fill="url(#vignette)" />
      </svg>
    </div>
  );
}
