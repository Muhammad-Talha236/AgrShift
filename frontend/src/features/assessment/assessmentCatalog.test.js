import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCountries, loadCrops, validateConditions, validateLocation } from './assessmentCatalog.js';

const country = { iso3: 'PAK', name: 'Pakistan', availableSlices: 15 };
const crop = { _id: 'database-id', cropId: 'wheat', displayName: 'Wheat' };
const response = (data, ok = true) => async () => ({ ok, status: ok ? 200 : 503,
  json: async () => ({ success: true, data }) });

test('catalogs accept database-backed records and use the configured endpoint', async () => {
  const urls = [];
  const fetcher = async (url) => {
    urls.push(url);
    return { ok: true, json: async () => ({ success: true, data: url.endsWith('countries') ? [country] : [crop] }) };
  };
  assert.deepEqual(await loadCountries(undefined, fetcher, 'http://test/api'), [country]);
  assert.deepEqual(await loadCrops(undefined, fetcher, 'http://test/api'), [crop]);
  assert.deepEqual(urls, ['http://test/api/recommendations/countries', 'http://test/api/recommendations/crops']);
});

test('catalog errors do not become static availability', async () => {
  await assert.rejects(loadCountries(undefined, response([], false), 'http://test/api'), /HTTP 503/);
  await assert.rejects(loadCrops(undefined, response([{ cropId: 'wheat', displayName: 'Wheat' }]), 'http://test/api'), /Database-backed/);
  await assert.rejects(loadCountries(undefined, response([{ iso3: 'PAK', name: 'Pakistan' }]), 'http://test/api'), /invalid availability/);
});

test('country validation requires a live catalog selection', () => {
  assert.ok(validateLocation({ country: '' }, [country]).country);
  assert.ok(validateLocation({ country: 'USA' }, [country]).country);
  assert.deepEqual(validateLocation({ country: 'PAK' }, [country]), {});
});

test('conditions require fields and block irrigated low input', () => {
  const base = { currentCrop: 'wheat', waterRegime: 'rainfed', managementLevel: 'high' };
  assert.deepEqual(validateConditions(base, [crop]), {});
  assert.ok(validateConditions({ ...base, currentCrop: '' }, [crop]).currentCrop);
  assert.ok(validateConditions({ ...base, waterRegime: '' }, [crop]).waterRegime);
  assert.ok(validateConditions({ ...base, managementLevel: '' }, [crop]).managementLevel);
  assert.ok(validateConditions({ ...base, waterRegime: 'irrigated', managementLevel: 'low' }, [crop]).managementLevel);
  assert.deepEqual(validateConditions({ ...base, managementLevel: 'low' }, [crop]), {});
});
