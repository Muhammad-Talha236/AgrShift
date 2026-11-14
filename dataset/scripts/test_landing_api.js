/**
 * AgriShift — Landing Page & API Verification Suite (Socket-free Unit/Integration Test)
 * Tests all landing endpoints, crop showcase, map config, and health checks directly via Express router.
 */

const path = require('path');
module.paths.push(path.resolve(__dirname, '../../backend/node_modules'));

const app = require('../../backend/src/app');

function invokeExpress(app, method, url, body = null) {
  return new Promise((resolve) => {
    const EventEmitter = require('events');
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = { 'content-type': 'application/json' };
    req.body = body || {};

    const res = new EventEmitter();
    let resData = '';
    res.statusCode = 200;
    res._headers = {};
    res.setHeader = (k, v) => { res._headers[k.toLowerCase()] = v; };
    res.getHeader = (k) => res._headers[k.toLowerCase()];
    res.removeHeader = (k) => { delete res._headers[k.toLowerCase()]; };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      resolve({ status: res.statusCode, data });
    };
    res.send = (data) => {
      try {
        resolve({ status: res.statusCode, data: JSON.parse(data) });
      } catch (e) {
        resolve({ status: res.statusCode, raw: data });
      }
    };
    res.end = (chunk) => {
      if (chunk) resData += chunk;
      try {
        resolve({ status: res.statusCode, data: JSON.parse(resData) });
      } catch (e) {
        resolve({ status: res.statusCode, raw: resData });
      }
    };

    app.handle(req, res);
  });
}

async function runSuite() {
  console.log('=== AgriShift Landing Page API Verification Suite ===\n');

  let passed = 0;
  let total = 0;

  async function check(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
  }

  // 1. Health Checks
  await check('GET /health & GET /api/health', async () => {
    const res1 = await invokeExpress(app, 'GET', '/health');
    if (res1.status !== 200 || res1.data.status !== 'ok') {
      throw new Error(`Unexpected /health: ${JSON.stringify(res1.data)}`);
    }

    const res2 = await invokeExpress(app, 'GET', '/api/health');
    if (res2.status !== 200 || res2.data.status !== 'ok') {
      throw new Error(`Unexpected /api/health: ${JSON.stringify(res2.data)}`);
    }
  });

  // 2. Landing Content
  await check('GET /api/landing returns hero, howItWorks, footer, and cta', async () => {
    const res = await invokeExpress(app, 'GET', '/api/landing');
    if (res.status !== 200 || !res.data.success) {
      throw new Error(`Failed landing request: ${JSON.stringify(res.data)}`);
    }
    const d = res.data.data;
    if (!d.hero || !d.hero.heading.includes('Grow Smarter')) {
      throw new Error(`Hero heading mismatch: ${d.hero?.heading}`);
    }
    if (!d.howItWorks || d.howItWorks.steps.length !== 3) {
      throw new Error(`Expected 3 howItWorks steps`);
    }
    if (!d.ctaSection || !d.ctaSection.buttonText.includes('Start Your Prediction')) {
      throw new Error(`CTA button mismatch`);
    }
  });

  // 3. Crop Showcase
  await check('GET /api/crops returns showcase crops (Rice, Wheat, Maize, Cotton, Sugarcane)', async () => {
    const res = await invokeExpress(app, 'GET', '/api/crops');
    if (res.status !== 200 || !res.data.success) {
      throw new Error(`Failed crop showcase: ${JSON.stringify(res.data)}`);
    }
    const crops = res.data.data;
    if (!Array.isArray(crops) || crops.length < 5) {
      throw new Error(`Expected at least 5 showcase crops, got ${crops.length}`);
    }
    const names = crops.map((c) => c.name);
    ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'].forEach((target) => {
      if (!names.includes(target)) {
        throw new Error(`Missing required showcase crop: ${target}`);
      }
    });
    crops.forEach((c) => {
      if (!c.imageUrl || !c.description) {
        throw new Error(`Crop ${c.name} missing image or description`);
      }
    });
  });

  // 4. Map Configuration
  await check('GET /api/map/config returns 3D terrain and satellite configuration', async () => {
    const res = await invokeExpress(app, 'GET', '/api/map/config');
    if (res.status !== 200 || !res.data.success) {
      throw new Error(`Failed map config: ${JSON.stringify(res.data)}`);
    }
    const cfg = res.data.data;
    if (!cfg.terrain || cfg.terrain.type !== 'raster-dem') {
      throw new Error(`Expected raster-dem terrain configuration`);
    }
    if (!cfg.baseLayers || cfg.baseLayers.length === 0) {
      throw new Error(`Missing baseLayers`);
    }
    if (!cfg.markers || cfg.markers.length < 3) {
      throw new Error(`Expected at least 3 agricultural markers`);
    }
  });

  // 5. Existing Recommendation API Preservation
  await check('GET /api/recommendations/crops preserves 8-crop rotation catalog', async () => {
    const res = await invokeExpress(app, 'GET', '/api/recommendations/crops');
    if (res.status !== 200 || !res.data.success) {
      throw new Error(`Failed recommendations crops catalog`);
    }
    if (res.data.data.length !== 8) {
      throw new Error(`Expected 8 rotation crops, got ${res.data.data.length}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`LANDING API TESTS: ${passed} / ${total} PASSED`);
  console.log(`========================================`);
}

runSuite().catch(console.error);
