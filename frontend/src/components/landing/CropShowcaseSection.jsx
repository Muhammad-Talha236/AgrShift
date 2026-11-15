import React from 'react';
import { SproutIcon } from '../common/Icons';

export default function CropShowcaseSection({ crops = [] }) {
  const fallbackCrops = [
    {
      cropId: 'rice',
      name: 'Rice',
      scientificName: 'Oryza sativa',
      category: 'Wetland Cereal Grain',
      description: 'Primary staple cereal crop thriving in warm climates with high moisture availability.',
      imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      cropId: 'wheat',
      name: 'Wheat',
      scientificName: 'Triticum aestivum',
      category: 'Temperate Cereal Grain',
      description: 'Vital global food staple cultivated across temperate regions for superior milling quality.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    },
    {
      cropId: 'maize',
      name: 'Maize',
      scientificName: 'Zea mays',
      category: 'C4 High-Biomass Cereal',
      description: 'High-energy C4 cereal crop with exceptional biomass accumulation and industrial versatility.',
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
    },
    {
      cropId: 'cotton',
      name: 'Cotton',
      scientificName: 'Gossypium hirsutum',
      category: 'Industrial Fiber Crop',
      description: 'Premier natural fiber crop driving agricultural economies in warm, sun-drenched valleys.',
      imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      cropId: 'sugarcane',
      name: 'Sugarcane',
      scientificName: 'Saccharum officinarum',
      category: 'Perennial Sucrose Crop',
      description: 'Robust perennial grass with massive sucrose accumulation and renewable biofuel potential.',
      imageUrl: 'https://media.istockphoto.com/id/1327494053/photo/sugarcane-field-farm-in-india-winter-season-nature.jpg?s=612x612&w=0&k=20&c=ITsqcoo1IVjpNcIjqpfc44hrj5M5etM7_fVUqdTm-gw=',
    },
  ];

  const displayCrops = crops && crops.length > 0 ? crops : fallbackCrops;

  return (
    <section id="crop-insights" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2E9] text-xs font-semibold tracking-wider text-[#245B3C] uppercase mb-4">
            <SproutIcon className="w-4 h-4 text-[#245B3C]" />
            Agronomic Diversity
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#173D2A] tracking-tight mb-4 font-['Plus_Jakarta_Sans']">
            Discover Agricultural Opportunities
          </h2>
          <p className="text-base sm:text-lg text-[#202820]/75 leading-relaxed">
            Explore different crops and their agricultural potential.
          </p>
        </div>

        {/* 5-Crop Grid with Real-world Photography & Clean Card Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-6">
          {displayCrops.map((crop) => (
            <div
              key={crop.cropId || crop.name}
              className="group bg-[#F8FAF7] rounded-2xl overflow-hidden border border-emerald-900/10 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Real-life crop photograph with consistent aspect ratio */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-emerald-950/5">
                <img
                  src={crop.imageUrl}
                  alt={`${crop.name} in agricultural field`}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] group-hover:text-[#245B3C] transition-colors">
                      {crop.name}
                    </h3>
                  </div>

                  {crop.scientificName && (
                    <div className="text-xs italic text-[#245B3C] font-serif mb-3">
                      {crop.scientificName}
                    </div>
                  )}

                  <p className="text-sm text-[#202820]/80 leading-relaxed font-normal">
                    {crop.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
