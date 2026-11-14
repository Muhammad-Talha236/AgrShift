// The shared catalog helpers return static lists after a request fails. This
// feature needs a strict result so a fallback cannot look like live coverage.
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function getCatalog(path, signal, fetcher = fetch, baseUrl = API_BASE_URL) {
  const response = await fetcher(`${baseUrl}/recommendations/${path}`, { signal });
  if (!response.ok) throw new Error(`Request failed (HTTP ${response.status}).`);
  const body = await response.json();
  if (body.success !== true || !Array.isArray(body.data)) {
    throw new Error('The server returned an invalid catalog response.');
  }
  return body.data;
}

export async function loadCountries(signal, fetcher, baseUrl) {
  const countries = await getCatalog('countries', signal, fetcher, baseUrl);
  if (countries.some((item) =>
    typeof item.iso3 !== 'string' || !/^[A-Z]{3}$/.test(item.iso3) ||
    typeof item.name !== 'string' || !item.name.trim() ||
    !Number.isFinite(item.availableSlices) || item.availableSlices < 1
  )) {
    throw new Error('The country catalog contains invalid availability data.');
  }
  return countries;
}

export async function loadCrops(signal, fetcher, baseUrl) {
  const crops = await getCatalog('crops', signal, fetcher, baseUrl);
  // Current backend DB documents contain _id; its hardcoded fallback does not.
  if (crops.some((item) =>
    !item._id || typeof item.cropId !== 'string' || !item.cropId.trim() ||
    typeof item.displayName !== 'string' || !item.displayName.trim()
  )) {
    throw new Error('Database-backed crop availability could not be verified.');
  }
  return crops;
}

export function validateLocation(values, countries) {
  if (!countries.some((item) => item.iso3 === values.country)) {
    return { country: 'Choose a country from the live list.' };
  }
  return {};
}

export function validateConditions(values, crops) {
  const errors = {};
  if (!crops.some((item) => item.cropId === values.currentCrop)) {
    errors.currentCrop = 'Choose a crop from the live list.';
  }
  if (!['irrigated', 'rainfed'].includes(values.waterRegime)) {
    errors.waterRegime = 'Choose a water regime.';
  }
  if (!['high', 'low'].includes(values.managementLevel)) {
    errors.managementLevel = 'Choose a management level.';
  }
  if (values.waterRegime === 'irrigated' && values.managementLevel === 'low') {
    errors.managementLevel = 'Low-input irrigated data is not available.';
  }
  return errors;
}
