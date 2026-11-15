import React, { useEffect, useRef, useState } from 'react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import { getRecommendations } from '../../services/api';
import { loadCountries, loadCrops, validateConditions, validateLocation } from './assessmentCatalog';
import { createAssessmentSubmitter } from './assessmentSubmission';

const STEPS = ['Farm location', 'Farming conditions', 'Review assessment'];
const INITIAL_VALUES = {
  country: '',
  city: '',
  coordinates: null,
  currentCrop: '',
  waterRegime: '',
  managementLevel: '',
};

const POPULAR_HUBS = {
  PAK: ['Lahore', 'Faisalabad', 'Multan', 'Sargodha', 'Bahawalpur', 'Sahiwal', 'Karachi', 'Peshawar'],
  USA: ['Des Moines', 'Fresno', 'Champaign', 'Lincoln', 'Bakersfield', 'Lubbock'],
  IND: ['Ludhiana', 'Amritsar', 'Karnal', 'Indore', 'Nagpur', 'Pune'],
};

export default function AssessmentWizard({ onRecommendationsReady, onNavigate }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [crops, setCrops] = useState([]);
  const [countryLoading, setCountryLoading] = useState(true);
  const [cropLoading, setCropLoading] = useState(true);
  const [countryError, setCountryError] = useState('');
  const [cropError, setCropError] = useState('');
  const [countryRetry, setCountryRetry] = useState(0);
  const [cropRetry, setCropRetry] = useState(0);
  const [submitter] = useState(createAssessmentSubmitter);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState('');
  const [locationError, setLocationError] = useState('');
  const [analyzingStage, setAnalyzingStage] = useState(0);
  const headingRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    loadCountries(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setCountries(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setCountryError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCountryLoading(false);
      });
    return () => controller.abort();
  }, [countryRetry]);

  useEffect(() => {
    const controller = new AbortController();
    loadCrops(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setCrops(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setCropError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCropLoading(false);
      });
    return () => controller.abort();
  }, [cropRetry]);

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  // Loading animation simulation when submitting
  useEffect(() => {
    if (!submitting) {
      setAnalyzingStage(0);
      return;
    }
    const timer1 = setTimeout(() => setAnalyzingStage(1), 500);
    const timer2 = setTimeout(() => setAnalyzingStage(2), 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [submitting]);

  const update = (field, value) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
      ...(field === 'waterRegime' && value === 'irrigated' && previous.managementLevel === 'low'
        ? { managementLevel: '' }
        : {}),
    }));
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      ...(field === 'waterRegime' ? { managementLevel: undefined } : {}),
    }));
    setRecommendation(null);
    setSubmissionError('');
  };

  const retryCountries = () => {
    setCountryLoading(true);
    setCountryError('');
    setCountries([]);
    setCountryRetry((count) => count + 1);
  };

  const retryCrops = () => {
    setCropLoading(true);
    setCropError('');
    setCrops([]);
    setCropRetry((count) => count + 1);
  };

  const loadOfflineCatalog = () => {
    const offlineCountries = [
      { iso3: 'PAK', name: 'Pakistan', availableSlices: 15 },
      { iso3: 'IND', name: 'India', availableSlices: 15 },
      { iso3: 'USA', name: 'United States', availableSlices: 15 },
      { iso3: 'CAN', name: 'Canada', availableSlices: 12 },
      { iso3: 'EGY', name: 'Egypt', availableSlices: 15 },
      { iso3: 'KEN', name: 'Kenya', availableSlices: 12 },
      { iso3: 'BRA', name: 'Brazil', availableSlices: 15 },
      { iso3: 'ARG', name: 'Argentina', availableSlices: 12 },
      { iso3: 'CHN', name: 'China', availableSlices: 15 },
      { iso3: 'TUR', name: 'Turkey', availableSlices: 12 },
      { iso3: 'BGD', name: 'Bangladesh', availableSlices: 12 },
      { iso3: 'IDN', name: 'Indonesia', availableSlices: 12 },
      { iso3: 'NGA', name: 'Nigeria', availableSlices: 12 },
      { iso3: 'ZAF', name: 'South Africa', availableSlices: 12 },
      { iso3: 'AUS', name: 'Australia', availableSlices: 15 },
    ];
    const offlineCrops = [
      { _id: 'off-wheat', cropId: 'wheat', displayName: 'Wheat' },
      { _id: 'off-rice', cropId: 'rice', displayName: 'Rice' },
      { _id: 'off-maize', cropId: 'maize', displayName: 'Maize (Corn)' },
      { _id: 'off-cotton', cropId: 'cotton', displayName: 'Cotton' },
      { _id: 'off-sugarcane', cropId: 'sugarcane', displayName: 'Sugarcane' },
      { _id: 'off-soybean', cropId: 'soybean', displayName: 'Soybean' },
      { _id: 'off-sorghum', cropId: 'sorghum', displayName: 'Sorghum' },
      { _id: 'off-potato', cropId: 'potato', displayName: 'Potato' },
    ];
    setCountries(offlineCountries);
    setCrops(offlineCrops);
    setCountryError('');
    setCropError('');
    setCountryLoading(false);
    setCropLoading(false);
  };

  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Live GPS is not supported in this browser.');
      return;
    }

    setDetectingLocation(true);
    setLocationError('');
    setLocationSuccess('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(4));
        const lng = Number(position.coords.longitude.toFixed(4));
        const coords = { lat, lng };

        let detectedCity = '';
        let detectedIso3 = '';

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
            { headers: { Accept: 'application/json' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            detectedCity = addr.city || addr.town || addr.county || addr.state_district || addr.state || '';
            const code = (addr.country_code || '').toUpperCase();
            const matched = countries.find(
              (c) =>
                c.iso3 === code ||
                c.iso3 === (code === 'PK' ? 'PAK' : code === 'US' ? 'USA' : code === 'IN' ? 'IND' : '') ||
                c.name.toLowerCase() === (addr.country || '').toLowerCase()
            );
            if (matched) {
              detectedIso3 = matched.iso3;
            }
          }
        } catch {
          // Keep coords even if reverse geocoding is blocked by network
        }

        setValues((prev) => ({
          ...prev,
          coordinates: coords,
          ...(detectedCity ? { city: detectedCity } : {}),
          ...(detectedIso3 ? { country: detectedIso3 } : {}),
        }));

        setDetectingLocation(false);
        setLocationSuccess(
          `GPS Acquired: ${lat}N, ${lng}E${detectedCity ? ` (${detectedCity})` : ''}`
        );
      },
      (err) => {
        setDetectingLocation(false);
        setLocationError(
          err.code === 1
            ? 'Location access was not granted. Please select your country and city manually.'
            : 'Could not determine GPS coordinates. Please select manually.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const goNext = () => {
    const nextErrors =
      step === 0 ? validateLocation(values, countries) : validateConditions(values, crops);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep((current) => Math.min(current + 1, 2));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  const countryName = countries.find((item) => item.iso3 === values.country)?.name;
  const cropName = crops.find((item) => item.cropId === values.currentCrop)?.displayName;
  const ready =
    Object.keys(validateLocation(values, countries)).length === 0 &&
    Object.keys(validateConditions(values, crops)).length === 0;

  const submitAssessment = () => {
    if (!ready || submitting) {
      if (!ready) setSubmissionError('Some selections are incomplete. Go back and review them.');
      return;
    }
    submitter.submit(values, getRecommendations, {
      onStart: () => {
        setSubmitting(true);
        setSubmissionError('');
      },
      onSuccess: (result) => {
        setRecommendation(result);
        try {
          onRecommendationsReady?.(result);
        } catch (error) {
          console.error('Assessment result consumer failed:', error);
        }
        // Direct seamless transition to Recommendation Dashboard
        if (onNavigate) {
          setTimeout(() => {
            onNavigate('recommendation');
          }, 800);
        }
      },
      onError: setSubmissionError,
      onComplete: () => setSubmitting(false),
    });
  };

  const activeHubs = POPULAR_HUBS[values.country] || [];

  return (
    <div className="max-w-3xl mx-auto">
      <nav aria-label="Assessment progress" className="mb-6">
        <ol className="grid grid-cols-3 gap-2 sm:gap-4">
          {STEPS.map((label, index) => (
            <li
              key={label}
              aria-current={step === index ? 'step' : undefined}
              className={`rounded-xl px-2 py-3 text-center text-xs sm:text-sm font-semibold border ${
                step === index
                  ? 'bg-[#245B3C] text-white border-[#245B3C] shadow-sm'
                  : 'bg-white text-[#173D2A]/70 border-emerald-900/10'
              }`}
            >
              <span className="block sm:inline">{index + 1}.</span> {label}
            </li>
          ))}
        </ol>
      </nav>

      <Card>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-xl sm:text-2xl font-bold text-[#173D2A] mb-2 focus:outline-none font-['Plus_Jakarta_Sans']"
        >
          {STEPS[step]}
        </h2>
        <p className="text-sm text-[#202820]/70 mb-6">Step {step + 1} of 3</p>

        {step === 0 && (
          <div className="space-y-6">
            <p className="text-sm text-[#202820]/75">
              Specify your agricultural location. We combine sovereign FAO/IIASA grids with satellite climatology for your specific region.
            </p>

            {/* Live GPS Detection Button */}
            <div className="p-4 rounded-2xl bg-[#EAF2E9]/60 border border-emerald-900/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#245B3C] block mb-0.5">
                    High-Precision Analysis
                  </span>
                  <p className="text-sm font-semibold text-[#173D2A]">
                    Detect my live farm location (GPS)
                  </p>
                  <p className="text-xs text-[#202820]/65">
                    Automatically locates your farm coordinates for precise 3D terrain elevation and weather data.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={detectLiveLocation}
                  disabled={detectingLocation}
                  className="whitespace-nowrap shrink-0 border-[#245B3C] text-[#245B3C] hover:bg-[#245B3C] hover:text-white"
                >
                  {detectingLocation ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Locating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Use Live GPS
                    </span>
                  )}
                </Button>
              </div>

              {locationSuccess && (
                <div className="mt-3 text-xs font-semibold text-emerald-800 bg-white/80 px-3 py-2 rounded-xl border border-emerald-500/30 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {locationSuccess}
                </div>
              )}
              {locationError && (
                <div className="mt-3 text-xs font-medium text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                  {locationError}
                </div>
              )}
            </div>

            {/* Country and City Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {countryLoading ? (
                  <LoadingSpinner message="Loading country list…" />
                ) : countryError ? (
                  <div className="space-y-3">
                    <Alert
                      variant="warning"
                      title="Backend Server Connection Notice"
                      message={
                        countryError.includes('Failed to fetch')
                          ? 'Could not connect to backend server. On Render free tier, the server sleeps when idle and takes ~30-50s to wake up on the first request. Click "Wake Up & Retry" or load the "Built-in Catalog" below.'
                          : countryError
                      }
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="primary" size="sm" onClick={retryCountries}>
                        🔄 Wake Up &amp; Retry
                      </Button>
                      <Button variant="outline" size="sm" onClick={loadOfflineCatalog}>
                        ⚡ Use Built-in Catalog (15+ Nations)
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Select
                    id="assessment-country"
                    label="Country"
                    required
                    value={values.country}
                    onChange={(event) => update('country', event.target.value)}
                    options={countries.map((item) => ({ value: item.iso3, label: item.name }))}
                    placeholder="Select your country"
                    error={errors.country}
                    aria-invalid={Boolean(errors.country)}
                  />
                )}
              </div>

              <div>
                <Input
                  id="assessment-city"
                  label="City / District / Region"
                  placeholder="e.g. Faisalabad, Multan, Fresno"
                  value={values.city || ''}
                  onChange={(event) => update('city', event.target.value)}
                  helperText={
                    values.coordinates
                      ? `Coordinates: ${values.coordinates.lat}N, ${values.coordinates.lng}E`
                      : 'Optional: helps zoom the 3D terrain to your exact area'
                  }
                />
              </div>
            </div>

            {/* Popular Region Hubs */}
            {activeHubs.length > 0 && (
              <div>
                <span className="text-xs font-bold text-[#173D2A] uppercase tracking-wider block mb-2">
                  Popular Agricultural Hubs in {countryName}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeHubs.map((hub) => (
                    <button
                      key={hub}
                      type="button"
                      onClick={() => update('city', hub)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        values.city === hub
                          ? 'bg-[#245B3C] text-white border-[#245B3C]'
                          : 'bg-[#F8FAF7] text-[#173D2A] border-emerald-900/10 hover:border-[#245B3C]/50 hover:bg-emerald-50'
                      }`}
                    >
                      {hub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            {cropLoading ? (
              <LoadingSpinner message="Loading crops…" />
            ) : cropError ? (
              <div className="space-y-3">
                <Alert
                  variant="warning"
                  title="Crop Verification Notice"
                  message={
                    cropError.includes('Failed to fetch')
                      ? 'Backend server is starting up. Please click "Wake Up & Retry" or load the "Built-in Catalog".'
                      : cropError
                  }
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" size="sm" onClick={retryCrops}>
                    🔄 Wake Up &amp; Retry
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadOfflineCatalog}>
                    ⚡ Use Built-in Catalog (8 Crops)
                  </Button>
                </div>
              </div>
            ) : crops.length === 0 ? (
              <EmptyState
                title="No crops available"
                description="The database returned no crop records. Try again shortly."
                actionLabel="Retry"
                onAction={retryCrops}
              />
            ) : (
              <Select
                id="assessment-crop"
                label="Current crop"
                required
                value={values.currentCrop}
                onChange={(event) => update('currentCrop', event.target.value)}
                options={crops.map((item) => ({ value: item.cropId, label: item.displayName }))}
                placeholder="Choose your current crop"
                error={errors.currentCrop}
                aria-invalid={Boolean(errors.currentCrop)}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="assessment-water"
                label="Water regime"
                required
                value={values.waterRegime}
                onChange={(event) => update('waterRegime', event.target.value)}
                options={[
                  { value: 'irrigated', label: 'Irrigated' },
                  { value: 'rainfed', label: 'Rainfed' },
                ]}
                placeholder="Choose water regime"
                error={errors.waterRegime}
                aria-invalid={Boolean(errors.waterRegime)}
              />
              <Select
                id="assessment-management"
                label="Management level"
                required
                value={values.managementLevel}
                onChange={(event) => update('managementLevel', event.target.value)}
                options={[
                  { value: 'high', label: 'High input (commercial)' },
                  ...(values.waterRegime === 'irrigated'
                    ? []
                    : [{ value: 'low', label: 'Low input (traditional)' }]),
                ]}
                placeholder="Choose management level"
                error={errors.managementLevel}
                aria-invalid={Boolean(errors.managementLevel)}
              />
            </div>

            {values.waterRegime === 'irrigated' && values.managementLevel === 'low' && (
              <Alert
                variant="error"
                message="Low-input irrigated data is not available. Choose high input or switch to rainfed."
              />
            )}
            {values.waterRegime === 'rainfed' && values.managementLevel === 'low' && (
              <Alert
                variant="warning"
                message="Rainfed low-input data is limited to sorghum suitability records. Availability for your country and crop combination is not verified here."
              />
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {!ready && (
              <Alert
                variant="error"
                message="Some selections are no longer valid. Go back and reload or update them before requesting recommendations."
              />
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                ['Country', countryName || values.country || 'Unavailable'],
                ['City / Region', values.city || 'Country Average'],
                ['Coordinates', values.coordinates ? `${values.coordinates.lat}°N, ${values.coordinates.lng}°E` : 'Regional Default'],
                ['Current crop', cropName || values.currentCrop || 'Unavailable'],
                ['Water regime', values.waterRegime === 'rainfed' ? 'Rainfed' : 'Irrigated'],
                ['Management', values.managementLevel === 'low' ? 'Low input' : 'High input'],
              ].map(([label, display]) => (
                <div key={label} className="rounded-xl border border-emerald-900/10 bg-[#F8FAF7] p-3.5">
                  <dt className="text-[10px] uppercase font-bold tracking-wider text-[#202820]/60">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-[#173D2A] truncate" title={display}>
                    {display}
                  </dd>
                </div>
              ))}
            </div>

            {/* Submission / In-Flight State */}
            {submitting ? (
              <div className="rounded-2xl border border-emerald-900/15 bg-gradient-to-br from-[#EAF2E9] to-white p-8 text-center space-y-4">
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-30" />
                  <div className="w-14 h-14 rounded-full border-4 border-[#245B3C] border-t-transparent animate-spin" />
                  <span className="absolute text-xl">🌱</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#173D2A]">
                    Generating Recommendations...
                  </h3>
                  <p className="text-sm text-[#202820]/75 mt-1">
                    Analyzing agro-climatic conditions for {values.city ? `${values.city}, ` : ''}{countryName}
                  </p>
                </div>
                <div className="max-w-md mx-auto space-y-2 text-left pt-2">
                  <div className={`flex items-center gap-2 text-xs font-medium ${analyzingStage >= 0 ? 'text-[#245B3C]' : 'text-gray-400'}`}>
                    <span>✓</span> Querying FAO/IIASA GAEZ v5 agro-ecological suitability matrix
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-medium ${analyzingStage >= 1 ? 'text-[#245B3C]' : 'text-gray-400'}`}>
                    <span>{analyzingStage >= 1 ? '✓' : '•'}</span> Fetching NASA POWER 30-year climatology & thermal indices
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-medium ${analyzingStage >= 2 ? 'text-[#245B3C]' : 'text-gray-400'}`}>
                    <span>{analyzingStage >= 2 ? '✓' : '•'}</span> Synthesizing 3 optimal crop rotation pathways
                  </div>
                </div>
              </div>
            ) : recommendation ? (
              <div role="status" className="rounded-2xl border border-emerald-500/30 bg-[#EAF2E9] p-6 space-y-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#245B3C] text-white flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#173D2A]">
                    Recommendations Ready!
                  </h3>
                  <p className="text-sm text-[#202820]/75 mt-1">
                    3 strategic crop rotation pathways have been computed for {values.city ? `${values.city}, ` : ''}{countryName}.
                  </p>
                </div>

                <div className="pt-2">
                  {onNavigate && (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto px-8 shadow-md"
                      onClick={() => onNavigate('recommendation')}
                    >
                      View Crop Recommendations & 3D Land &rarr;
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-900/10 bg-[#EAF2E9]/70 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-[#173D2A]">Generate Crop Recommendations</h3>
                    <p className="text-sm text-[#202820]/75 mt-0.5">
                      Ready to analyze your farmland against FAO and NASA planetary benchmarks.
                    </p>
                  </div>
                  <Button
                    onClick={submitAssessment}
                    loading={submitting}
                    disabled={!ready}
                    size="lg"
                    className="whitespace-nowrap shadow-sm"
                  >
                    Generate Recommendations &rarr;
                  </Button>
                </div>
                {submissionError && (
                  <Alert
                    variant="error"
                    title="Could not generate recommendations"
                    message={submissionError}
                    className="mt-4"
                  />
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3 mt-8 pt-6 border-t border-emerald-900/10">
          {step > 0 ? (
            <Button variant="outline" onClick={goBack} disabled={submitting}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < 2 && (
            <Button
              onClick={goNext}
              disabled={
                step === 0
                  ? countryLoading || Boolean(countryError) || countries.length === 0
                  : cropLoading || Boolean(cropError) || crops.length === 0
              }
            >
              Continue to {STEPS[step + 1]}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
