import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/common/Card';

/**
 * Photorealistic 3D Farmland & Seasonal Growth Simulator
 * - Whole-scene realistic seasonal color & lighting grading (Spring -> Summer -> Autumn -> Winter)
 * - Dynamically displays the EXACT 3 crops recommended in the pathways below
 * - Unobstructed layout: Crop inspector moved cleanly below the farm so NO elements or pins are hidden
 * - Non-overlapping, carefully calibrated 3D field pins
 * - Live animated rainfall simulation with canvas splash rings
 * - Smooth volume-style seasonal scrubber dial (0 - 100%)
 */

const ALL_CROP_ENCYCLOPEDIA = {
  wheat: {
    displayName: 'Wheat (Gandum)',
    scientificName: 'Triticum aestivum',
    category: 'Rabi Staple Cereal',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    springStage: 'Tillering & Stem Extension',
    summerStage: 'Post-Harvest Stubble / Fallow',
    autumnStage: 'Seedbed Preparation & Sowing',
    winterStage: 'Crown Rooting & Active Vegetative Stage',
    waterDemand: 'Medium (350 - 450 mm)',
  },
  rice: {
    displayName: 'Rice (Dhan / Basmati)',
    scientificName: 'Oryza sativa',
    category: 'Kharif Wetland Cereal',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80',
    springStage: 'Nursery Seedbed Preparation',
    summerStage: 'Flooded Paddy Transplantation & Tillering',
    autumnStage: 'Panicle Ripening & Harvest Drainage',
    winterStage: 'Post-Harvest Straw Incorporation',
    waterDemand: 'High (1,100 - 1,400 mm)',
  },
  maize: {
    displayName: 'Maize (Makai)',
    scientificName: 'Zea mays',
    category: 'C4 High-Biomass Cereal',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    springStage: 'Spring Crop Sowing (Feb/Mar)',
    summerStage: 'Tasseling, Silking & Rapid Grain Filling',
    autumnStage: 'Maturity, Cob Drying & Combining',
    winterStage: 'Dry Storage & Soil Aeration',
    waterDemand: 'High (500 - 650 mm)',
  },
  cotton: {
    displayName: 'Cotton (Kapas)',
    scientificName: 'Gossypium hirsutum',
    category: 'Summer Cash & Industrial Fiber',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80',
    springStage: 'Early Sowing & Emergence',
    summerStage: 'Peak Squaring & White Flower Blooming',
    autumnStage: 'White Boll Bursting & Picking Flushes',
    winterStage: 'Stalk Shredding & Deep Winter Plowing',
    waterDemand: 'Medium to High (650 - 850 mm)',
  },
  sugarcane: {
    displayName: 'Sugarcane (Kamad / Ganna)',
    scientificName: 'Saccharum officinarum',
    category: 'Perennial Sucrose Crop',
    image: 'https://images.unsplash.com/photo-1596706059298-25f0a3e9c606?auto=format&fit=crop&w=600&q=80',
    springStage: 'Sett Planting & Sprouting',
    summerStage: 'Grand Growth Period & Heavy Tillering',
    autumnStage: 'Sucrose Accumulation & Internode Elongation',
    winterStage: 'Harvesting, Sugar Mills Crushing & Ratoon Management',
    waterDemand: 'Very High (1,500 - 2,200 mm)',
  },
  soybean: {
    displayName: 'Soybean (Soya)',
    scientificName: 'Glycine max',
    category: 'Legume / Soil Nitrogen Fixer',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    springStage: 'Rhizobia Inoculation & Early Leaf Canopy',
    summerStage: 'Canopy Flowering & Maximum Nitrogen Nodulation',
    autumnStage: 'Pod Senescence & Combining',
    winterStage: 'Residual Organic Nitrogen Feeding Soil',
    waterDemand: 'Low to Medium (300 - 450 mm)',
  },
  sorghum: {
    displayName: 'Sorghum (Jowar)',
    scientificName: 'Sorghum bicolor',
    category: 'C4 Drought-Tolerant Coarse Grain',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
    springStage: 'Warm Soil Testing & Early Sowing',
    summerStage: 'Rapid Vegetative Expansion & Head Emergence',
    autumnStage: 'Grain Hardening & Panicle Harvest',
    winterStage: 'Crop Residue Soil Moisture Blanket',
    waterDemand: 'Low / Drought Resilient (250 - 400 mm)',
  },
  potato: {
    displayName: 'Potato (Aloo)',
    scientificName: 'Solanum tuberosum',
    category: 'High-Value Tuber Crop',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    springStage: 'Spring Harvest & Sorting',
    summerStage: 'Cold Storage Seed Preservation',
    autumnStage: 'Autumn Seed Tuber Sowing & Earthing Up',
    winterStage: 'Tuber Bulking & Dehaulming for Skin Setting',
    waterDemand: 'Medium / Sensitive (400 - 550 mm)',
  },
};

export default function Farm3DLandView({
  city = '',
  countryName = 'Pakistan',
  coordinates = null,
  pathways = null,
}) {
  // Volume slider: 0 = Spring, 33 = Summer, 66 = Autumn, 100 = Winter
  const [sliderVal, setSliderVal] = useState(38);
  const [isRaining, setIsRaining] = useState(false);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const canvasRef = useRef(null);

  // Extract the EXACT 3 crops from the recommendation pathways
  const recommendedPlots = [
    {
      pathwayKey: 'economicReturn',
      strategyTitle: 'Economic Return',
      tagline: 'Maximum Harvest & Revenue',
      icon: '💰',
      cropData: pathways?.economicReturn?.recommendedCrop || { cropId: 'maize', displayName: 'Maize (Corn)' },
      metrics: pathways?.economicReturn?.keyMetrics,
      compositeScore: pathways?.economicReturn?.compositeScore || 96,
      pin: { top: '65%', left: '46%' }, // Front lower crop plot
    },
    {
      pathwayKey: 'soilRestoration',
      strategyTitle: 'Soil Restoration',
      tagline: 'Soil Health & Natural Nitrogen',
      icon: '🌱',
      cropData: pathways?.soilRestoration?.recommendedCrop || { cropId: 'soybean', displayName: 'Soybean' },
      metrics: pathways?.soilRestoration?.keyMetrics,
      compositeScore: pathways?.soilRestoration?.compositeScore || 94,
      pin: { top: '55%', left: '22%' }, // Left middle crop plot
    },
    {
      pathwayKey: 'waterResilience',
      strategyTitle: 'Water Resilience',
      tagline: 'Drought Defense & Moisture Protection',
      icon: '💧',
      cropData: pathways?.waterResilience?.recommendedCrop || { cropId: 'sorghum', displayName: 'Sorghum' },
      metrics: pathways?.waterResilience?.keyMetrics,
      compositeScore: pathways?.waterResilience?.compositeScore || 89,
      pin: { top: '35%', left: '33%' }, // Upper left crop plot
    },
  ];

  // Whole-scene photorealistic color & lighting transitions across seasons
  const getSeasonalAesthetics = (val) => {
    if (val < 25) {
      // Spring
      const f = val / 25;
      return {
        key: 'spring',
        name: 'Spring / Bahar',
        tag: 'Fresh Growth & Sowing',
        icon: '🌸',
        temp: Math.round(18 + f * 9),
        moisture: Math.round(72 - f * 10),
        filterStyle: `brightness(${1.03 + f * 0.03}) contrast(1.04) saturate(${1.18 + f * 0.08}) hue-rotate(${6 - f * 5}deg)`,
        ambientGradient: 'from-emerald-400/15 via-transparent to-amber-200/10',
        tip: 'Favorable seedbed temperature and active canal supplies. Ideal for early sowing and fertilizer incorporation.',
      };
    } else if (val < 55) {
      // Summer
      const f = (val - 25) / 30;
      return {
        key: 'summer',
        name: 'Summer / Kharif',
        tag: 'Peak Growth & Warmth',
        icon: '☀️',
        temp: Math.round(27 + f * 13),
        moisture: Math.round(62 - f * 20),
        filterStyle: `brightness(${1.06 + f * 0.03}) contrast(1.07) saturate(${1.24 + f * 0.04}) hue-rotate(${-f * 4}deg)`,
        ambientGradient: 'from-amber-400/20 via-transparent to-emerald-400/10',
        tip: 'Maximum leaf canopy and transpiration. Ensure consistent irrigation during morning or evening to protect yield.',
      };
    } else if (val < 80) {
      // Autumn
      const f = (val - 55) / 25;
      return {
        key: 'autumn',
        name: 'Autumn / Khizan',
        tag: 'Golden Harvest & Maturity',
        icon: '🌾',
        temp: Math.round(33 - f * 13),
        moisture: Math.round(42 - f * 10),
        filterStyle: `brightness(1.02) contrast(1.08) sepia(${0.2 + f * 0.22}) saturate(${1.22 + f * 0.08}) hue-rotate(${-6 - f * 8}deg)`,
        ambientGradient: 'from-amber-600/25 via-orange-400/15 to-transparent',
        tip: 'Crops turn golden amber as grain fills and matures. Prepare combines and manage crop stubble without burning.',
      };
    } else {
      // Winter
      const f = (val - 80) / 20;
      return {
        key: 'winter',
        name: 'Winter / Rabi',
        tag: 'Cold Rest & Rabi Seedlings',
        icon: '❄️',
        temp: Math.round(20 - f * 12),
        moisture: Math.round(52 + f * 16),
        filterStyle: `brightness(${0.97 - f * 0.03}) contrast(1.01) saturate(${0.86 - f * 0.12}) hue-rotate(${10 + f * 8}deg)`,
        ambientGradient: 'from-sky-300/25 via-slate-400/15 to-emerald-800/10',
        tip: 'Cool temperatures favor Rabi wheat tillering and root deepening. Conserve residual soil moisture.',
      };
    }
  };

  const currentAesthetic = getSeasonalAesthetics(sliderVal);
  const locationLabel = city ? `${city}, ${countryName}` : countryName;

  const activePlot = recommendedPlots[selectedCropIndex] || recommendedPlots[0];
  const activeCropKey = (activePlot.cropData?.cropId || '').toLowerCase();
  const cropDetails = ALL_CROP_ENCYCLOPEDIA[activeCropKey] || {
    displayName: activePlot.cropData?.displayName || 'Recommended Crop',
    scientificName: activePlot.cropData?.scientificName || 'Crop Species',
    category: activePlot.strategyTitle,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    springStage: 'Active Sowing & Emergence',
    summerStage: 'Vegetative Canopy Expansion',
    autumnStage: 'Maturity & Harvest',
    winterStage: 'Post-Harvest Rest & Rabi Tillering',
    waterDemand: 'Medium Requirement',
  };

  // Canvas particle engine for rain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    const drops = [];
    const dropCount = isRaining ? 110 : 0;
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        len: 12 + Math.random() * 16,
        speed: 13 + Math.random() * 7,
        opacity: 0.35 + Math.random() * 0.45,
      });
    }

    const ripples = [];
    let animId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isRaining) {
        // Atmospheric rain haze
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.fillRect(0, 0, width, height);

        // Falling raindrops
        ctx.lineWidth = 1.3;
        for (let i = 0; i < drops.length; i++) {
          const d = drops[i];
          ctx.strokeStyle = `rgba(186, 230, 253, ${d.opacity})`;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 2, d.y + d.len);
          ctx.stroke();

          d.y += d.speed;
          d.x -= 1.6;

          // Splash on ground
          if (d.y > height * 0.45 && Math.random() > 0.82) {
            ripples.push({
              x: d.x,
              y: d.y,
              radius: 1,
              alpha: 0.55,
            });
          }

          if (d.y > height) {
            d.y = -20;
            d.x = Math.random() * width;
          }
        }

        // Draw ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          ctx.strokeStyle = `rgba(224, 242, 254, ${r.alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius * 2, r.radius * 0.8, 0, 0, Math.PI * 2);
          ctx.stroke();

          r.radius += 0.55;
          r.alpha -= 0.045;
          if (r.alpha <= 0) ripples.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [isRaining]);

  return (
    <Card className="overflow-hidden p-0 border border-emerald-900/10 shadow-sm">
      {/* Top Header & Simulation Controls */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-[#F8FAF7] border-b border-emerald-900/10 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">🏡</span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] leading-tight">
              3D Farmland &amp; Seasonal Growth Simulator
            </h3>
            <p className="text-[11px] text-[#202820]/65">
              Live farm model for <strong>{locationLabel}</strong>
              {coordinates ? ` • [${coordinates[0]}°N, ${coordinates[1]}°E]` : ''}
            </p>
          </div>
        </div>

        {/* Live Weather & Rain Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRaining((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isRaining
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-white text-sky-800 border-sky-200 hover:bg-sky-50'
            }`}
          >
            <span className="text-sm">{isRaining ? '🌧️' : '🌦️'}</span>
            <span>{isRaining ? 'Rain Active (+18mm)' : 'Simulate Rain'}</span>
          </button>

          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-emerald-900/10 text-xs font-bold text-[#173D2A]">
            <span>{currentAesthetic.icon}</span>
            <span>{currentAesthetic.temp}°C</span>
          </div>
        </div>
      </div>

      {/* Main 3D Farmland Viewport: CLEAN, UNOBSTRUCTED, ZERO CLUTTER */}
      <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] bg-[#2E3C2D] overflow-hidden select-none">
        {/* Photorealistic 3D Miniature Farm Image with Whole-Scene Seasonal Color & Lighting Shift */}
        <img
          src="/images/farm-3d-real.jpg"
          alt="Photorealistic 3D Farmland Model"
          className="w-full h-full object-cover object-center transition-all duration-500"
          style={{
            filter: currentAesthetic.filterStyle,
          }}
        />

        {/* Dynamic Seasonal Sunlight Ambient Glow Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none bg-gradient-to-tr ${currentAesthetic.ambientGradient} mix-blend-color-burn transition-all duration-500`}
        />

        {/* Rain Particle Engine Canvas Overlay */}
        <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none w-full h-full" />

        {/* Overcast Cloud Dimming when Raining */}
        {isRaining && (
          <div className="absolute inset-0 z-15 bg-slate-950/25 pointer-events-none transition-opacity duration-300" />
        )}

        {/* Current Season Floating Badge (Top Left, compact and non-intrusive) */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-xs font-bold text-[#173D2A] shadow-sm border border-emerald-900/10">
          <span className="text-base">{currentAesthetic.icon}</span>
          <span>{currentAesthetic.name}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-[#245B3C]">
            {currentAesthetic.tag}
          </span>
        </div>

        {/* DYNAMIC FIELD PINS: Carefully spaced across the 3 fields, NEVER colliding */}
        {recommendedPlots.map((plot, index) => {
          const isSelected = selectedCropIndex === index;
          const cropName = plot.cropData?.displayName || plot.cropData?.cropId || 'Crop';
          return (
            <button
              key={plot.pathwayKey}
              type="button"
              onClick={() => setSelectedCropIndex(index)}
              style={{ top: plot.pin.top, left: plot.pin.left }}
              className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#245B3C] text-white border-white scale-110 ring-4 ring-emerald-400/60'
                  : 'bg-white/95 text-[#173D2A] border-emerald-900/20 hover:scale-105'
              }`}
            >
              <span>{plot.icon}</span>
              <span>{cropName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/10 font-bold">
                {plot.compositeScore}
              </span>
            </button>
          );
        })}
      </div>

      {/* DEDICATED CROP INTELLIGENCE BAR (Placed Cleanly BELOW the Farm — Nothing Obscured!) */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAF7] border-t border-emerald-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Crop Profile & Real Image */}
          <div className="flex items-center gap-3">
            <img
              src={cropDetails.image}
              alt={cropDetails.displayName}
              className="w-12 h-12 rounded-xl object-cover border border-emerald-900/15 shrink-0 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#245B3C] bg-emerald-100 px-2 py-0.5 rounded-md">
                  {activePlot.strategyTitle}
                </span>
                <span className="text-xs font-bold text-[#173D2A]">
                  Fit Score: {activePlot.compositeScore}/100
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-[#173D2A] leading-tight">
                {cropDetails.displayName}
              </h4>
              <p className="text-[11px] text-[#202820]/65 italic">
                {cropDetails.scientificName} • {cropDetails.category}
              </p>
            </div>
          </div>

          {/* Current Season Growth & Water Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs flex-1 max-w-md">
            <div className="p-2 rounded-xl bg-white border border-emerald-900/8">
              <span className="text-[9px] uppercase font-bold text-[#202820]/50 block">
                {currentAesthetic.name.split('/')[0]} Stage
              </span>
              <p className="text-xs font-semibold text-[#173D2A] mt-0.5">
                {currentAesthetic.key === 'spring' && cropDetails.springStage}
                {currentAesthetic.key === 'summer' && cropDetails.summerStage}
                {currentAesthetic.key === 'autumn' && cropDetails.autumnStage}
                {currentAesthetic.key === 'winter' && cropDetails.winterStage}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-white border border-emerald-900/8">
              <span className="text-[9px] uppercase font-bold text-[#202820]/50 block">
                Water Requirement
              </span>
              <p className="text-xs font-semibold text-[#245B3C] mt-0.5">
                {cropDetails.waterDemand}
              </p>
            </div>
          </div>

          {/* Quick Plot Switcher Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
            {recommendedPlots.map((plot, idx) => {
              const isSelected = selectedCropIndex === idx;
              const name = plot.cropData?.displayName || plot.cropData?.cropId || 'Crop';
              return (
                <button
                  key={plot.pathwayKey}
                  type="button"
                  onClick={() => setSelectedCropIndex(idx)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#245B3C] text-white border-[#245B3C] shadow-xs'
                      : 'bg-white text-[#173D2A] border-emerald-900/10 hover:bg-emerald-50'
                  }`}
                >
                  <span>{plot.icon}</span>
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTINUOUS SEASONAL SCRUBBER SLIDER (Volume Control) */}
      <div className="p-4 sm:p-5 bg-white border-t border-emerald-900/10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#173D2A] uppercase tracking-wider">
              Seasonal Climate Dial
            </span>
            <span className="text-xs text-[#202820]/60">• Drag smoothly like a volume slider:</span>
          </div>
          <span className="text-xs font-bold text-[#245B3C]">
            Soil Moisture: {currentAesthetic.moisture}%
          </span>
        </div>

        {/* Continuous Slider Track */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full h-3 bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-400 to-sky-300 rounded-lg appearance-none cursor-pointer accent-[#245B3C] shadow-inner"
            aria-label="Continuous Season Slider"
          />

          <div className="flex justify-between text-xs font-bold text-[#202820]/70 px-1">
            <button
              type="button"
              onClick={() => setSliderVal(10)}
              className={`hover:text-[#245B3C] cursor-pointer transition-colors ${sliderVal < 25 ? 'text-[#245B3C] font-black scale-105' : ''}`}
            >
              🌸 Spring (Bahar)
            </button>
            <button
              type="button"
              onClick={() => setSliderVal(40)}
              className={`hover:text-[#245B3C] cursor-pointer transition-colors ${sliderVal >= 25 && sliderVal < 55 ? 'text-[#245B3C] font-black scale-105' : ''}`}
            >
              ☀️ Summer (Kharif)
            </button>
            <button
              type="button"
              onClick={() => setSliderVal(68)}
              className={`hover:text-[#245B3C] cursor-pointer transition-colors ${sliderVal >= 55 && sliderVal < 80 ? 'text-[#245B3C] font-black scale-105' : ''}`}
            >
              🌾 Autumn (Khizan)
            </button>
            <button
              type="button"
              onClick={() => setSliderVal(92)}
              className={`hover:text-[#245B3C] cursor-pointer transition-colors ${sliderVal >= 80 ? 'text-[#245B3C] font-black scale-105' : ''}`}
            >
              ❄️ Winter (Rabi)
            </button>
          </div>
        </div>

        {/* Agronomic Tip */}
        <p className="text-xs text-[#202820]/75 pt-1 border-t border-emerald-900/5">
          <strong className="text-[#173D2A]">Field Action:</strong> {currentAesthetic.tip}
        </p>
      </div>
    </Card>
  );
}
