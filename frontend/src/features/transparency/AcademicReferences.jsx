import React from 'react';
import Card from '../../components/common/Card';

/**
 * Peer-Reviewed Citations & Official References
 * Owner: Anaya (Agricultural Research & Scientific Transparency)
 */
export default function AcademicReferences() {
  const references = [
    {
      citation: 'Fischer, G., Nachtergaele, F.O., Prieler, S., Teixeira, E., Toth, G., van Velthuizen, H., Verelst, L., & Wiberg, D. (2021).',
      title: 'Global Agro-Ecological Zones v5 (GAEZ v5) — Model Documentation and Methodology.',
      source: 'Food and Agriculture Organization of the United Nations (FAO) & International Institute for Applied Systems Analysis (IIASA), Rome/Laxenburg.',
      link: 'https://gaez.fao.org/',
    },
    {
      citation: 'NASA Langley Research Center. (2024).',
      title: 'Prediction Of Worldwide Energy Resources (POWER) — Agroclimatology Methodology (Release 9.0).',
      source: 'NASA Earth Science Applied Sciences Program, Hampton, VA.',
      link: 'https://power.larc.nasa.gov/',
    },
    {
      citation: 'USDA Natural Resources Conservation Service (NRCS). (2020).',
      title: 'Conservation Practice Standard: Conservation Crop Rotation (Code 328).',
      source: 'United States Department of Agriculture, Washington, D.C.',
      link: 'https://www.nrcs.usda.gov/',
    },
    {
      citation: 'Peoples, M. B., Brockwell, J., Herridge, D. F., et al. (2009).',
      title: 'The contributions of nitrogen-fixing crop legumes to the productivity of agricultural systems.',
      source: 'Symbiosis, 48(1-3), 1–17.',
      link: 'https://doi.org/10.1007/BF03179980',
    },
    {
      citation: 'Borrell, A. K., Mullet, J. E., George-Jaeggli, B., et al. (2014).',
      title: 'Drought adaptation of sorghum: Functional mechanisms for stay-green QTL.',
      source: 'Journal of Experimental Botany, 65(21), 6251–6263.',
      link: 'https://doi.org/10.1093/jxb/eru232',
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] mb-2">
          Academic Citations & Data Sources
        </h2>
        <p className="text-sm text-[#202820]/75 leading-relaxed">
          Primary scientific literature, dataset documentation, and agronomic guidelines supporting AgriShift.
        </p>
      </div>

      <Card>
        <ul className="divide-y divide-emerald-900/10">
          {references.map((ref, idx) => (
            <li key={idx} className="py-4 first:pt-0 last:pb-0">
              <p className="text-xs font-mono text-[#245B3C] mb-1">{ref.citation}</p>
              <h3 className="text-sm font-bold text-[#173D2A] mb-1">{ref.title}</h3>
              <p className="text-xs text-[#202820]/70 mb-2">{ref.source}</p>
              <a
                href={ref.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-semibold text-[#245B3C] hover:underline"
              >
                Access Source Material &rarr;
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
