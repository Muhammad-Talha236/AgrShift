import React from 'react';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';

/**
 * Scientific Limitations & Disclosures
 * Owner: Anaya (Agricultural Research & Scientific Transparency)
 */
export default function LimitationsAndCaveats() {
  const limitations = [
    {
      title: '1. Modeled Potential vs. Real Harvest Reality',
      description:
        'GAEZ v5 attainable yields reflect agro-ecological potential under optimal nutrient and agronomic practices. Real farm yields are influenced by localized factors such as certified seed purity, timely mechanical sowing, weed pressure, and severe episodic weather events not captured in long-term historical normals.',
    },
    {
      title: '2. Sensor-less Soil Nutrient Inference',
      description:
        'AgriShift infers biological nitrogen and soil restoration benefits based on botanical classifications and Rhizobium biology. The integrated Earth observation datasets do not include live, in-situ electrochemical soil measurements (such as soil pH, organic carbon content, or available phosphorus). Farmers must perform physical soil tests prior to field application.',
    },
    {
      title: '3. Regional Archetypes vs. Microclimates',
      description:
        'NASA POWER agroclimatological indicators represent 30-year regional climatological normals. Local topographical anomalies—such as sheltered frost pockets, riverine fog belts, or valley katabatic winds—create microclimates that differ from regional satellite grids.',
    },
    {
      title: '4. Commercial Off-Take & Market Realities',
      description:
        'A crop may achieve an exceptional agronomic suitability score, but its commercial viability depends on sovereign supply chains, local milling infrastructure, storage grain elevators, and commodity price dynamics.',
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] mb-2">
          Scientific Disclosures & Model Boundaries
        </h2>
        <p className="text-sm text-[#202820]/75 leading-relaxed">
          In strict compliance with NASA Space Apps open-science standards, AgriShift openly documents all analytical assumptions and model boundaries.
        </p>
      </div>

      <Alert
        variant="warning"
        title="Agronomic Guidance Notice"
        message="AgriShift is a strategic macro-regional planning tool designed to guide crop rotation transitions. It is intended to complement, not replace, localized soil testing, extension services, and certified agronomist counsel."
        className="mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {limitations.map((item) => (
          <Card key={item.title}>
            <h3 className="text-base font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] mb-2">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#202820]/75 leading-relaxed">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
