import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

/**
 * Interactive 3D Isometric Farm Land View with Dynamic Season Simulator
 * Replaces satellite map with a stylized 3D miniature farm diorama
 * allowing farmers to visualize land conditions across all four seasons.
 */
const SEASONS = {
  spring: {
    id: 'spring',
    name: 'Spring / Planting',
    urdu: 'Bahar / Kasht',
    icon: '🌸',
    color: '#16A34A',
    bgGradient: 'from-emerald-50 via-teal-50 to-amber-50/30',
    grassColor: '#65A30D',
    cropColor: '#84CC16',
    soilColor: '#78350F',
    waterColor: '#38BDF8',
    barnRoof: '#DC2626',
    treeFoliage: '#4ADE80',
    blossoms: true,
    snow: false,
    sunLight: 'Warm Morning (22°C - 28°C)',
    soilMoisture: 'Optimal (65%)',
    waterAvailability: 'Good Canal Inflow',
    recommendation: 'Ideal window for seedbed preparation, deep plowing, and sowing Kharif/summer crops.',
  },
  summer: {
    id: 'summer',
    name: 'Summer / Peak Growth',
    urdu: 'Garmi / Kharif',
    icon: '☀️',
    color: '#059669',
    bgGradient: 'from-amber-50 via-emerald-50 to-green-50',
    grassColor: '#15803D',
    cropColor: '#22C55E',
    soilColor: '#92400E',
    waterColor: '#0EA5E9',
    barnRoof: '#B91C1C',
    treeFoliage: '#15803D',
    blossoms: false,
    snow: false,
    sunLight: 'Intense Solar Rad. (32°C - 42°C)',
    soilMoisture: 'Moderate to Low (45%)',
    waterAvailability: 'High Evapotranspiration',
    recommendation: 'Ensure timely irrigation cycles during early morning or sunset; monitor heat stress.',
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn / Golden Harvest',
    urdu: 'Khizan / Fasl Katai',
    icon: '🌾',
    color: '#D97706',
    bgGradient: 'from-amber-100/60 via-orange-50 to-emerald-50/40',
    grassColor: '#B45309',
    cropColor: '#F59E0B',
    soilColor: '#713F12',
    waterColor: '#0284C7',
    barnRoof: '#991B1B',
    treeFoliage: '#D97706',
    blossoms: false,
    snow: false,
    sunLight: 'Golden Hour (20°C - 30°C)',
    soilMoisture: 'Low / Drying (38%)',
    waterAvailability: 'Canal Reduction',
    recommendation: 'Peak harvest window for mature grains. Clear stubble responsibly without burning to protect organic matter.',
  },
  winter: {
    id: 'winter',
    name: 'Winter / Rabi Rest',
    urdu: 'Sardi / Rabi',
    icon: '❄️',
    color: '#0284C7',
    bgGradient: 'from-slate-100 via-sky-50 to-emerald-50/30',
    grassColor: '#475569',
    cropColor: '#10B981',
    soilColor: '#451A03',
    waterColor: '#60A5FA',
    barnRoof: '#CBD5E1',
    treeFoliage: '#64748B',
    blossoms: false,
    snow: true,
    sunLight: 'Crisp & Mild (8°C - 18°C)',
    soilMoisture: 'Good Dew / Fog (60%)',
    waterAvailability: 'Moderate Water Need',
    recommendation: 'Favorable conditions for Rabi wheat and winter legumes; monitor night-time frost risk.',
  },
};

export default function Farm3DLandView({ city = '', countryName = 'Pakistan', coordinates = null }) {
  const [activeSeason, setActiveSeason] = useState('summer');
  const [activeFeature, setActiveFeature] = useState(null);

  const season = SEASONS[activeSeason];
  const locationLabel = city ? `${city}, ${countryName}` : countryName;

  return (
    <Card className="overflow-hidden p-0 border border-emerald-900/10 shadow-sm">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-[#F8FAF7] border-b border-emerald-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#245B3C]">
              Interactive 3D Land Simulator
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
            Farm Landscape &amp; Seasonal Rotation
          </h3>
          <p className="text-xs text-[#202820]/70 mt-0.5">
            Explore how seasonal climatic shifts impact your soil, water, and crop canopy in <strong>{locationLabel}</strong>
            {coordinates ? ` [${coordinates[0]}°N, ${coordinates[1]}°E]` : ''}.
          </p>
        </div>

        {/* Season Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-emerald-900/10 shadow-2xs">
          {Object.values(SEASONS).map((s) => {
            const isSelected = activeSeason === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSeason(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#245B3C] text-white shadow-xs scale-102'
                    : 'text-[#173D2A]/75 hover:bg-emerald-50 hover:text-[#173D2A]'
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.name.split('/')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Isometric View Canvas */}
      <div className={`relative w-full h-[360px] sm:h-[420px] bg-gradient-to-b ${season.bgGradient} transition-colors duration-700 flex items-center justify-center overflow-hidden`}>
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-[radial-gradient(#245B3C_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Floating Season & Weather Badge */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-xs font-bold text-[#173D2A] shadow-sm border border-emerald-900/10 flex items-center gap-2">
            <span className="text-base">{season.icon}</span>
            <span>{season.name}</span>
            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md">
              {season.urdu}
            </span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-black/60 text-white text-[11px] font-medium backdrop-blur-sm max-w-xs shadow-xs">
            {season.sunLight} • Soil Moisture: {season.soilMoisture}
          </div>
        </div>

        {/* 3D Isometric SVG Diorama */}
        <div className="relative w-full max-w-2xl h-full flex items-center justify-center p-4">
          <svg
            viewBox="0 0 900 620"
            className="w-full h-full max-h-[380px] drop-shadow-[0_25px_35px_rgba(23,61,42,0.18)] transition-all duration-700"
            style={{ transform: 'perspective(900px) rotateX(16deg)' }}
          >
            <defs>
              {/* Grass Surface Gradient */}
              <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={season.grassColor} stopOpacity="0.9" />
                <stop offset="100%" stopColor={season.grassColor} stopOpacity="1" />
              </linearGradient>

              {/* Underground Soil Cross Section Gradient */}
              <linearGradient id="soilCutGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5B3826" />
                <stop offset="100%" stopColor="#301A0E" />
              </linearGradient>

              {/* River Gradient */}
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={season.waterColor} />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              {/* Barn Roof Gradient */}
              <linearGradient id="barnRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={season.barnRoof} />
                <stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>
            </defs>

            {/* BASE SOIL UNDERGROUND THICKNESS (Isometric Extrusion) */}
            <polygon points="450,470 780,310 780,345 450,505" fill="#3E2723" />
            <polygon points="450,470 120,310 120,345 450,505" fill="#4E342E" />

            {/* TOP ISOMETRIC GRASS PLATFORM */}
            <polygon
              points="450,110 780,270 450,430 120,270"
              fill="url(#grassGrad)"
              className="transition-colors duration-700"
            />

            {/* FARM PATHWAY / GRAVEL ROAD */}
            <polygon
              points="410,180 500,225 380,375 290,330"
              fill="#D4B996"
              opacity="0.9"
            />

            {/* MEANDERING IRRIGATION CANAL / STREAM (Right Side) */}
            <path
              d="M 680,220 Q 640,290 670,350 Q 685,380 660,425 L 610,400 Q 630,360 610,310 Q 590,260 630,195 Z"
              fill="url(#riverGrad)"
              className="transition-colors duration-700"
            />

            {/* Little Wooden Bridge across River */}
            <polygon points="630,305 660,320 650,335 620,320" fill="#8D6E63" stroke="#4E342E" strokeWidth="2" />

            {/* CROP FIELD 1 (Left Lower Quadrant: Grain/Cereal Rows) */}
            <g
              className="cursor-pointer transition-transform hover:scale-102"
              onClick={() => setActiveFeature('crops')}
            >
              <polygon points="210,290 320,345 250,380 140,325" fill={season.soilColor} />
              {/* Crop Rows */}
              {[1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1={210 + i * 20}
                  y1={290 + i * 10}
                  x2={140 + i * 20}
                  y2={325 + i * 10}
                  stroke={season.cropColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="transition-colors duration-700"
                />
              ))}
            </g>

            {/* CROP FIELD 2 (Lower Center Quadrant: Rotation Legumes / Vegetables) */}
            <g
              className="cursor-pointer transition-transform hover:scale-102"
              onClick={() => setActiveFeature('rotation')}
            >
              <polygon points="360,330 480,270 540,300 420,360" fill={season.soilColor} />
              {[1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1={360 + i * 18}
                  y1={330 - i * 9}
                  x2={420 + i * 18}
                  y2={360 - i * 9}
                  stroke={season.cropColor}
                  strokeWidth="6"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                  className="transition-colors duration-700"
                />
              ))}
            </g>

            {/* RED BARN (Central Homestead & Storage) */}
            <g
              className="cursor-pointer transition-transform hover:scale-102"
              onClick={() => setActiveFeature('barn')}
            >
              {/* Barn Front Left Face */}
              <polygon points="410,180 480,145 480,205 410,240" fill="#B91C1C" />
              {/* Barn Right Face */}
              <polygon points="480,145 540,175 540,235 480,205" fill="#991B1B" />
              {/* Barn Gable Peak Front */}
              <polygon points="410,180 445,150 480,145 445,175" fill="#DC2626" />
              {/* Barn Roof Left */}
              <polygon points="445,130 505,160 480,175 420,145" fill="url(#barnRoofGrad)" />
              {/* Barn Roof Right */}
              <polygon points="445,130 505,160 540,175 480,145" fill="#7F1D1D" />
              {/* White Cross Doors */}
              <polygon points="430,205 460,190 460,225 430,240" fill="#FFFFFF" />
              <line x1="430" y1="205" x2="460" y2="225" stroke="#B91C1C" strokeWidth="2" />
              <line x1="430" y1="240" x2="460" y2="190" stroke="#B91C1C" strokeWidth="2" />

              {/* Silo next to Barn */}
              <path d="M 545,160 L 565,170 L 565,225 L 545,215 Z" fill="#94A3B8" />
              <ellipse cx="555" cy="160" rx="10" ry="5" fill="#CBD5E1" />

              {/* Snow on roof if winter */}
              {season.snow && (
                <polygon points="445,130 505,160 480,175 420,145" fill="#F8FAFC" opacity="0.85" />
              )}
            </g>

            {/* BLUE TRACTOR & HAYSTACKS */}
            <g>
              {/* Hay Bales */}
              <rect x="530" y="245" width="22" height="14" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
              <rect x="545" y="240" width="22" height="14" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
              <rect x="538" y="230" width="20" height="12" rx="2" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />

              {/* Little Tractor */}
              <circle cx="500" cy="275" r="9" fill="#1E293B" />
              <circle cx="482" cy="278" r="6" fill="#1E293B" />
              <rect x="480" y="262" width="24" height="12" rx="2" fill="#0284C7" />
              <rect x="492" y="254" width="12" height="8" rx="1" fill="#E0F2FE" opacity="0.9" />
            </g>

            {/* LIVESTOCK PASTURE (Upper Left Fence & Sheep) */}
            <g
              className="cursor-pointer"
              onClick={() => setActiveFeature('livestock')}
            >
              {/* Wooden Fence */}
              <line x1="280" y1="190" x2="370" y2="235" stroke="#78350F" strokeWidth="2" strokeDasharray="8,6" />
              <line x1="280" y1="190" x2="230" y2="215" stroke="#78350F" strokeWidth="2" strokeDasharray="8,6" />
              <line x1="230" y1="215" x2="320" y2="260" stroke="#78350F" strokeWidth="2" strokeDasharray="8,6" />

              {/* Sheep */}
              {[
                { x: 260, y: 215 },
                { x: 290, y: 230 },
                { x: 310, y: 210 },
                { x: 275, y: 240 },
              ].map((s, i) => (
                <g key={i}>
                  <ellipse cx={s.x} cy={s.y} rx="7" ry="5" fill="#FFFFFF" stroke="#E2E8F0" />
                  <circle cx={s.x + 6} cy={s.y - 2} r="3" fill="#1E293B" />
                </g>
              ))}
            </g>

            {/* FRUIT ORCHARD TREES (Upper Right) */}
            <g
              className="cursor-pointer"
              onClick={() => setActiveFeature('orchard')}
            >
              {[
                { x: 570, y: 130 },
                { x: 620, y: 155 },
                { x: 670, y: 180 },
                { x: 610, y: 120 },
                { x: 660, y: 145 },
              ].map((t, idx) => (
                <g key={idx} className="transition-colors duration-700">
                  {/* Trunk */}
                  <rect x={t.x - 2} y={t.y + 10} width="5" height="14" fill="#5C4033" />
                  {/* Foliage */}
                  <circle cx={t.x} cy={t.y} r="16" fill={season.treeFoliage} />
                  <circle cx={t.x + 6} cy={t.y - 4} r="12" fill={season.treeFoliage} opacity="0.8" />
                  {/* Blossoms or Apples */}
                  {season.blossoms && (
                    <>
                      <circle cx={t.x - 5} cy={t.y - 2} r="2.5" fill="#F472B6" />
                      <circle cx={t.x + 4} cy={t.y + 4} r="2.5" fill="#FBCFE8" />
                      <circle cx={t.x + 8} cy={t.y - 5} r="2.5" fill="#FFFFFF" />
                    </>
                  )}
                  {season.id === 'summer' && (
                    <>
                      <circle cx={t.x - 4} cy={t.y} r="2.5" fill="#EF4444" />
                      <circle cx={t.x + 5} cy={t.y + 5} r="2.5" fill="#DC2626" />
                      <circle cx={t.x + 6} cy={t.y - 6} r="2.5" fill="#EF4444" />
                    </>
                  )}
                  {season.snow && (
                    <path d={`M ${t.x - 12} ${t.y - 4} Q ${t.x} ${t.y - 12} ${t.x + 12} ${t.y - 4} Z`} fill="#F8FAFC" />
                  )}
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Interactive Feature Tooltip / Info Overlay */}
        {activeFeature && (
          <div className="absolute bottom-4 left-4 right-4 z-20 sm:left-auto sm:right-4 sm:max-w-xs p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-900/10 shadow-lg text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between font-bold text-[#173D2A] mb-1">
              <span>
                {activeFeature === 'crops' && '🌾 Grain & Cereal Plot'}
                {activeFeature === 'rotation' && '🌱 Rotation & Legume Plot'}
                {activeFeature === 'barn' && '🏡 Farm Storage & Machinery'}
                {activeFeature === 'livestock' && '🐑 Pasture & Organic Manure'}
                {activeFeature === 'orchard' && '🍎 Agroforestry & Windbreak'}
              </span>
              <button
                onClick={() => setActiveFeature(null)}
                className="text-gray-400 hover:text-gray-600 font-bold px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-[#202820]/75 leading-relaxed">
              {activeFeature === 'crops' &&
                'Primary crop field calibrated to your regional yield benchmark. Rotation here prevents nutrient depletion.'}
              {activeFeature === 'rotation' &&
                'Secondary plot for nitrogen-fixing legumes or drought-tolerant cover crops to regenerate soil microbes.'}
              {activeFeature === 'barn' &&
                'Central farm depot for post-harvest storage, grain protection, and irrigation valve control.'}
              {activeFeature === 'livestock' &&
                'Integrated livestock grazing cycle providing natural manure to enrich soil organic carbon.'}
              {activeFeature === 'orchard' &&
                'Tree perimeter acting as a natural windbreak, curbing topsoil wind erosion and moderating microclimates.'}
            </p>
          </div>
        )}
      </div>

      {/* Seasonal Insights Bar */}
      <div className="p-4 sm:p-5 bg-white border-t border-emerald-900/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#F8FAF7] border border-emerald-900/8">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#202820]/50 block mb-0.5">
              Water &amp; Irrigation
            </span>
            <p className="text-xs font-bold text-[#173D2A]">{season.waterAvailability}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAF7] border border-emerald-900/8">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#202820]/50 block mb-0.5">
              Atmospheric &amp; Thermal
            </span>
            <p className="text-xs font-bold text-[#173D2A]">{season.sunLight}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#EAF2E9]/60 border border-emerald-900/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#245B3C] block mb-0.5">
              Agronomic Action
            </span>
            <p className="text-xs font-semibold text-[#173D2A] leading-tight">{season.recommendation}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
