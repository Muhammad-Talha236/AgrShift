import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

/**
 * Assessment Summary Card
 * Owner: Faiza — Recommendation Dashboard
 * Shows the farmer's input parameters and climate profile applied.
 */
export default function AssessmentSummaryCard({ summary }) {
  if (!summary) return null;

  const climate = summary.climateProfileApplied;

  return (
    <Card>
      <h3 className="text-sm font-bold text-[#173D2A] uppercase tracking-wider mb-4">
        Assessment Summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <InfoTile label="Country" value={summary.country?.name || summary.country?.iso3} />
        <InfoTile
          label="Current Crop"
          value={summary.currentCrop?.displayName || 'Not specified'}
        />
        <InfoTile label="Water Regime" value={capitalize(summary.waterRegime)} />
        <InfoTile label="Management" value={capitalize(summary.managementLevel)} />
      </div>

      {/* Climate Profile */}
      {climate && (
        <div className="bg-[#F8FAF7] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🌤️</span>
            <span className="text-xs font-bold text-[#173D2A] uppercase tracking-wider">
              Climate Profile
            </span>
            <Badge variant={climate.isRegionalArchetype ? 'success' : 'warning'}>
              {climate.confidenceRating?.replace(/_/g, ' ')}
            </Badge>
          </div>

          <p className="text-xs text-[#202820]/60 mb-3">{climate.locationName}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {climate.annualMeanTempC != null && (
              <MiniMetric label="Mean Temp" value={`${climate.annualMeanTempC.toFixed(1)}°C`} />
            )}
            {climate.annualPrecipitationEstimateMmYear != null && (
              <MiniMetric
                label="Precipitation"
                value={`${climate.annualPrecipitationEstimateMmYear.toFixed(0)} mm/yr`}
              />
            )}
            {climate.meanSolarRadiationKwhM2Day != null && (
              <MiniMetric
                label="Solar Rad."
                value={`${climate.meanSolarRadiationKwhM2Day.toFixed(1)} kWh/m²/d`}
              />
            )}
            {climate.meanRelativeHumidityPercent != null && (
              <MiniMetric
                label="Humidity"
                value={`${climate.meanRelativeHumidityPercent.toFixed(0)}%`}
              />
            )}
          </div>

          {climate.disclosure && (
            <p className="text-[11px] text-[#202820]/45 mt-3 leading-relaxed border-l-2 border-emerald-900/10 pl-3">
              {climate.disclosure}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

function InfoTile({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#202820]/50 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-bold text-[#173D2A]">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="bg-white rounded-xl px-3 py-2 border border-emerald-900/8">
      <p className="text-[9px] font-semibold text-[#202820]/40 uppercase tracking-wider">{label}</p>
      <p className="text-xs font-bold text-[#173D2A] mt-0.5">{value}</p>
    </div>
  );
}

function capitalize(str) {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
