import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

/**
 * Crop Rotation Agronomy & Biological Principles
 */
export default function CropRotationScience() {
  const principles = [
    {
      title: 'Biological Nitrogen Fixation (Rhizobium Symbiosis)',
      badge: 'Legume Pathway',
      description:
        'Leguminous crops like Soybean establish mutualistic endosymbiosis with soil bacterium Rhizobium. Bacteria convert inert atmospheric nitrogen (N2) into bioavailable ammonium (NH4+), leaving 30–70 kg N/ha in root nodule residues for subsequent cereal crops.',
      benefits: [
        'Reduces synthetic nitrogen fertilizer demand and greenhouse gas emissions',
        'Enriches soil microbiological biodiversity and fungal-to-bacterial ratios',
        'Breaks cereal root-rot pathogens (Gaeumannomyces graminis) and nematode cycles',
      ],
    },
    {
      title: 'C4 Photosynthetic Water Resilience (Sorghum & Maize)',
      badge: 'Water Resilience',
      description:
        'C4 plants utilize spatial separation of CO2 fixation (bundle sheath cells) to minimize photorespiration under high heat and drought. Sorghum maintains high water-use efficiency (WUE) with an extensive fibrous root system reaching up to 2 meters deep.',
      benefits: [
        'Requires 30–45% less water per ton of biomass compared to high-water C3 cereals',
        'Exceptional survival during temporary mid-season dry spells',
        'Superior root mass enhances deep soil organic carbon sequestration',
      ],
    },
    {
      title: 'Monoculture Disruption & Botanical Family Shifts',
      badge: 'Pathogen Break',
      description:
        'Planting consecutive crops from the same botanical family (e.g. Wheat after Wheat, or Rice after Rice) creates localized pathogen reservoirs and exhausts identical soil nutrient profiles.',
      benefits: [
        'Rotational diversification alters weed canopy competition dynamics',
        'Interrupts host-specific insect life cycles without chemical intervention',
        'Stabilizes farm economic revenue through harvest calendar diversification',
      ],
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] mb-2">
          Agronomic Principles of Crop Rotation
        </h2>
        <p className="text-sm text-[#202820]/75 leading-relaxed">
          The scientific rationale underpinning AgriShift’s transition pathways, grounded in soil microbiology and plant physiology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {principles.map((p) => (
          <Card key={p.title} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="success">{p.badge}</Badge>
              </div>
              <h3 className="text-base font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] mb-2">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#202820]/75 leading-relaxed mb-4">
                {p.description}
              </p>
            </div>
            <div className="border-t border-emerald-900/10 pt-3">
              <span className="text-xs font-bold text-[#245B3C] block mb-1">Key Scientific Benefits:</span>
              <ul className="text-xs text-[#202820]/70 space-y-1">
                {p.benefits.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
