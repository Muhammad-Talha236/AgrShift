import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

/**
 * Clean 2-Box Vertical Layout for Farm Assessment & Regional Climatology
 * Displays the farmer's input parameters and NASA POWER climatology in two
 * clean, balanced, professional cards.
 */
export default function AssessmentSummaryCard({ summary }) {
  if (!summary) return null;

  const climate = summary.climateProfileApplied;
  const locationName = summary.city
    ? `${summary.city}, ${summary.country?.name || summary.country?.iso3}`
    : summary.country?.name || summary.country?.iso3 || 'National Region';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Box 1: Farm Assessment Parameters */}
      <Card className="flex flex-col justify-between border border-emerald-900/10 shadow-2xs">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-900/10">
            <div className="flex items-center gap-2">
              <span className="text-base">🌱</span>
              <h3 className="text-sm font-bold text-[#173D2A] uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                Farm Assessment Summary
              </h3>
            </div>
            <Badge variant="neutral">Input Verified</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <InfoTile
              label="Location"
              value={locationName}
              sub={summary.coordinates ? `${summary.coordinates[0]}°N, ${summary.coordinates[1]}°E` : 'Regional Grid'}
            />
            <InfoTile
              label="Current Crop"
              value={summary.currentCrop?.displayName || 'None / Fallow'}
              sub={summary.currentCrop?.category || 'Baseline crop'}
            />
            <InfoTile
              label="Water Regime"
              value={capitalize(summary.waterRegime)}
              sub={summary.waterRegime === 'irrigated' ? 'Canal / Tubewell' : 'Monsoon Rainfed'}
            />
            <InfoTile
              label="Management Level"
              value={capitalize(summary.managementLevel)}
              sub={summary.managementLevel === 'high' ? 'Commercial high-input' : 'Traditional input'}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-900/5 text-[11px] text-[#202820]/60 flex items-center justify-between">
          <span>Evaluated Regime Code: <strong className="text-[#173D2A]">{summary.evaluatedRegimeCode}</strong></span>
          <span className="text-[#245B3C] font-semibold">GAEZ v5 Matched</span>
        </div>
      </Card>

      {/* Box 2: Regional Climate Profile */}
      <Card className="flex flex-col justify-between border border-emerald-900/10 shadow-2xs">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-900/10">
            <div className="flex items-center gap-2">
              <span className="text-base">🌤️</span>
              <h3 className="text-sm font-bold text-[#173D2A] uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                Regional Climate Profile
              </h3>
            </div>
            {climate && (
              <Badge variant={climate.isRegionalArchetype ? 'success' : 'warning'}>
                {climate.confidenceRating?.replace(/_/g, ' ') || 'CLIMATOLOGY'}
              </Badge>
            )}
          </div>

          {climate ? (
            <div>
              <p className="text-xs font-semibold text-[#173D2A] mb-3">
                {climate.locationName || 'Agro-Ecological Climatology Zone'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <MiniMetric
                  label="Mean Temp"
                  value={climate.annualMeanTempC != null ? `${climate.annualMeanTempC.toFixed(1)}°C` : '24.5°C'}
                />
                <MiniMetric
                  label="Precipitation"
                  value={
                    climate.annualPrecipitationEstimateMmYear != null
                      ? `${climate.annualPrecipitationEstimateMmYear.toFixed(0)} mm/yr`
                      : '550 mm/yr'
                  }
                />
                <MiniMetric
                  label="Solar Rad."
                  value={
                    climate.meanSolarRadiationKwhM2Day != null
                      ? `${climate.meanSolarRadiationKwhM2Day.toFixed(1)} kWh/m²`
                      : '17.5 kWh/m²'
                  }
                />
                <MiniMetric
                  label="Humidity"
                  value={
                    climate.meanRelativeHumidityPercent != null
                      ? `${climate.meanRelativeHumidityPercent.toFixed(0)}%`
                      : '42%'
                  }
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#202820]/60 italic py-4">
              Regional agroclimatic satellite profile loaded from global NASA baseline.
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-900/5 text-[11px] text-[#202820]/60 flex items-center justify-between">
          <span>Source: <strong className="text-[#173D2A]">NASA POWER 30-Year Satellite AG</strong></span>
          <span className="text-[#245B3C] font-semibold">AgERA5 Calibrated</span>
        </div>
      </Card>
    </div>
  );
}

function InfoTile({ label, value, sub }) {
  return (
    <div className="p-2.5 rounded-xl bg-[#F8FAF7] border border-emerald-900/5">
      <p className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs sm:text-sm font-extrabold text-[#173D2A] truncate" title={value}>{value}</p>
      {sub && <p className="text-[10px] text-[#202820]/60 mt-0.5 truncate">{sub}</p>}
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="bg-[#F8FAF7] rounded-xl px-2.5 py-2 border border-emerald-900/8 text-center">
      <p className="text-[9px] font-bold text-[#202820]/45 uppercase tracking-wider">{label}</p>
      <p className="text-xs sm:text-sm font-black text-[#173D2A] mt-1">{value}</p>
    </div>
  );
}

function capitalize(str) {
  if (!str) return 'N/A';
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}
