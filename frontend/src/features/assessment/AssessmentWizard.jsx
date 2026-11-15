import React, { useEffect, useRef, useState } from 'react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Select from '../../components/common/Select';
import { getRecommendations } from '../../services/api';
import { loadCountries, loadCrops, validateConditions, validateLocation } from './assessmentCatalog';
import { createAssessmentSubmitter } from './assessmentSubmission';

const STEPS = ['Farm location', 'Farming conditions', 'Review assessment'];
const INITIAL_VALUES = { country: '', currentCrop: '', waterRegime: '', managementLevel: '' };

export default function AssessmentWizard({ onRecommendationsReady }) {
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

  const update = (field, value) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
      ...(field === 'waterRegime' && value === 'irrigated' && previous.managementLevel === 'low'
        ? { managementLevel: '' }
        : {}),
    }));
    setErrors((previous) => ({ ...previous, [field]: undefined,
      ...(field === 'waterRegime' ? { managementLevel: undefined } : {}) }));
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

  const goNext = () => {
    const nextErrors = step === 0
      ? validateLocation(values, countries)
      : validateConditions(values, crops);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep((current) => Math.min(current + 1, 2));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  const countryName = countries.find((item) => item.iso3 === values.country)?.name;
  const cropName = crops.find((item) => item.cropId === values.currentCrop)?.displayName;
  const ready = Object.keys(validateLocation(values, countries)).length === 0 &&
    Object.keys(validateConditions(values, crops)).length === 0;

  const submitAssessment = () => {
    if (!ready || submitting) {
      if (!ready) setSubmissionError('Some selections are incomplete or no longer available. Go back and review them.');
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
      },
      onError: setSubmissionError,
      onComplete: () => setSubmitting(false),
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <nav aria-label="Assessment progress" className="mb-6">
        <ol className="grid grid-cols-3 gap-2 sm:gap-4">
          {STEPS.map((label, index) => (
            <li key={label} aria-current={step === index ? 'step' : undefined}
              className={`rounded-xl px-2 py-3 text-center text-xs sm:text-sm font-semibold border ${step === index
                ? 'bg-[#245B3C] text-white border-[#245B3C]'
                : 'bg-white text-[#173D2A]/70 border-emerald-900/10'}`}>
              <span className="block sm:inline">{index + 1}.</span> {label}
            </li>
          ))}
        </ol>
      </nav>

      <Card>
        <h2 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl font-bold text-[#173D2A] mb-2 focus:outline-none">
          {STEPS[step]}
        </h2>
        <p className="text-sm text-[#202820]/70 mb-6">Step {step + 1} of 3</p>

        {step === 0 && (
          <div className="space-y-5">
            <p className="text-sm text-[#202820]/75">Select the country where you farm. Country names come from the live GAEZ catalog.</p>
            {countryLoading ? <LoadingSpinner message="Loading countries…" /> : countryError ? (
              <div className="space-y-3">
                <Alert variant="error" title="Could not load countries" message={countryError} />
                <Button variant="outline" onClick={retryCountries}>Retry countries</Button>
              </div>
            ) : countries.length === 0 ? (
              <EmptyState title="No countries available" description="The database returned no country records. Try again shortly."
                actionLabel="Retry" onAction={retryCountries} />
            ) : (
              <Select id="assessment-country" label="Country" required value={values.country}
                onChange={(event) => update('country', event.target.value)}
                options={countries.map((item) => ({ value: item.iso3, label: item.name }))}
                placeholder="Choose your country" error={errors.country}
                aria-invalid={Boolean(errors.country)} />
            )}
            <Alert variant="info" message="The country list confirms at least one dataset record. Availability for a particular crop and water or management combination cannot be confirmed by this API." />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            {cropLoading ? <LoadingSpinner message="Loading crops…" /> : cropError ? (
              <div className="space-y-3">
                <Alert variant="error" title="Could not verify crops" message={cropError} />
                <Button variant="outline" onClick={retryCrops}>Retry crops</Button>
              </div>
            ) : crops.length === 0 ? (
              <EmptyState title="No crops available" description="The database returned no crop records. Try again shortly."
                actionLabel="Retry" onAction={retryCrops} />
            ) : (
              <Select id="assessment-crop" label="Current crop" required value={values.currentCrop}
                onChange={(event) => update('currentCrop', event.target.value)}
                options={crops.map((item) => ({ value: item.cropId, label: item.displayName }))}
                placeholder="Choose your current crop" error={errors.currentCrop}
                aria-invalid={Boolean(errors.currentCrop)} />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select id="assessment-water" label="Water regime" required value={values.waterRegime}
                onChange={(event) => update('waterRegime', event.target.value)}
                options={[{ value: 'irrigated', label: 'Irrigated' }, { value: 'rainfed', label: 'Rainfed' }]}
                placeholder="Choose water regime" error={errors.waterRegime}
                aria-invalid={Boolean(errors.waterRegime)} />
              <Select id="assessment-management" label="Management level" required value={values.managementLevel}
                onChange={(event) => update('managementLevel', event.target.value)}
                options={[{ value: 'high', label: 'High input' },
                  ...(values.waterRegime === 'irrigated' ? [] : [{ value: 'low', label: 'Low input' }])]}
                placeholder="Choose management level" error={errors.managementLevel}
                aria-invalid={Boolean(errors.managementLevel)} />
            </div>
            {values.waterRegime === 'irrigated' && values.managementLevel === 'low' &&
              <Alert variant="error" message="Low-input irrigated data is not available. Choose high input or switch to rainfed." />}
            {values.waterRegime === 'rainfed' && values.managementLevel === 'low' &&
              <Alert variant="warning" message="Rainfed low-input data is limited to sorghum suitability records. Availability for your country and crop combination is not verified here." />}
            <Alert variant="info" message="The crop list is a catalog, not a country-specific availability check. The recommendation request will verify the selected country and regime." />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            {!ready && <Alert variant="error" message="Some selections are no longer valid. Go back and reload or update them before requesting recommendations." />}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Country', countryName || 'Unavailable', values.country],
                ['Current crop', cropName || 'Unavailable', values.currentCrop],
                ['Water regime', values.waterRegime === 'rainfed' ? 'Rainfed' : 'Irrigated'],
                ['Management level', values.managementLevel === 'low' ? 'Low input' : 'High input'],
              ].map(([label, display, code]) => (
                <div key={label} className="rounded-2xl border border-emerald-900/10 bg-[#F8FAF7] p-4">
                  <dt className="text-xs uppercase font-bold tracking-wider text-[#202820]/60">{label}</dt>
                  <dd className="mt-1 text-base font-semibold text-[#173D2A]">{display}{code && <span className="ml-2 text-xs font-normal text-[#202820]/60">({code})</span>}</dd>
                </div>
              ))}
            </dl>
            {values.waterRegime === 'rainfed' && values.managementLevel === 'low' &&
              <Alert variant="warning" message="Only sorghum has rainfed low-input suitability data in the current dataset; a recommendation for this selection is not guaranteed." />}
            <Alert variant="info" message="Country and crop were loaded from database-backed catalogs, but this exact country and regime combination is verified only when you request recommendations." />
            <div className="rounded-2xl border border-emerald-900/10 bg-[#EAF2E9] p-5">
              <h3 className="font-bold text-[#173D2A]">Request recommendations</h3>
              <p className="text-sm text-[#202820]/75 mt-1">Your selections will be sent to the recommendation service. Results will remain here for review.</p>
              {submissionError && <Alert variant="error" title="Could not generate recommendations" message={submissionError} className="mt-4" />}
              {recommendation ? (
                <div role="status" className="mt-4 space-y-3">
                  <Alert variant="success" title="Assessment processed" message="The recommendation service returned three pathways." />
                  <ul className="list-disc pl-5 text-sm text-[#173D2A]">
                    {['economicReturn', 'soilRestoration', 'waterResilience'].map((key) => (
                      <li key={key}>{recommendation.pathways[key].strategyTitle}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Button className="mt-4" onClick={submitAssessment} loading={submitting} disabled={!ready}>
                  {submissionError ? 'Retry recommendations' : 'Generate recommendations'}
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3 mt-8 pt-6 border-t border-emerald-900/10">
          {step > 0 ? <Button variant="outline" onClick={goBack} disabled={submitting}>Back</Button> : <span />}
          {step < 2 && <Button onClick={goNext} disabled={step === 0 ? countryLoading || Boolean(countryError) || countries.length === 0 : cropLoading || Boolean(cropError) || crops.length === 0}>
            Continue to {STEPS[step + 1]}
          </Button>}
        </div>
      </Card>
    </div>
  );
}
