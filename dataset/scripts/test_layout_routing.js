const fs = require('fs');
const path = require('path');

console.log('=== Verifying Talha Step 2: App Layout, Routing & Placeholder Pages ===\n');

let passCount = 0;
let totalCount = 0;

function assert(condition, testName, details) {
  totalCount++;
  if (condition) {
    passCount++;
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}: ${details}`);
  }
}

// 1. Check AppLayout.jsx
const appLayoutPath = path.resolve(__dirname, '../../frontend/src/components/layout/AppLayout.jsx');
const appLayoutSrc = fs.existsSync(appLayoutPath) ? fs.readFileSync(appLayoutPath, 'utf8') : '';
assert(
  appLayoutSrc.includes('export default function AppLayout') &&
  appLayoutSrc.includes('<Navbar') &&
  appLayoutSrc.includes('<Footer') &&
  appLayoutSrc.includes('{children}'),
  'AppLayout.jsx wraps Navbar, children, and Footer',
  'Missing AppLayout or required wrappers'
);

// 2. Check Navbar.jsx
const navbarPath = path.resolve(__dirname, '../../frontend/src/components/layout/Navbar.jsx');
const navbarSrc = fs.existsSync(navbarPath) ? fs.readFileSync(navbarPath, 'utf8') : '';
assert(
  navbarSrc.includes("'#home'") &&
  navbarSrc.includes("'#assessment'") &&
  navbarSrc.includes("'#recommendation'") &&
  navbarSrc.includes("'#transparency'") &&
  navbarSrc.includes('activePage'),
  'Navbar.jsx contains 4 routes and active page indicators',
  'Navbar missing one or more route hashes'
);

// 3. Check Footer.jsx
const footerPath = path.resolve(__dirname, '../../frontend/src/components/layout/Footer.jsx');
const footerSrc = fs.existsSync(footerPath) ? fs.readFileSync(footerPath, 'utf8') : '';
assert(
  footerSrc.includes("'#home'") &&
  footerSrc.includes("'#assessment'") &&
  footerSrc.includes("'#recommendation'") &&
  footerSrc.includes("'#transparency'"),
  'Footer.jsx contains 4 route links',
  'Footer missing route anchors'
);

// 4. Check AssessmentPage.jsx
const assessmentPath = path.resolve(__dirname, '../../frontend/src/pages/AssessmentPage.jsx');
const assessmentSrc = fs.existsSync(assessmentPath) ? fs.readFileSync(assessmentPath, 'utf8') : '';
assert(
  assessmentSrc.includes('export default function AssessmentPage') &&
  assessmentSrc.includes('PageContainer') &&
  assessmentSrc.includes('Shahzaman'),
  'AssessmentPage.jsx exists with PageContainer & Shahzaman ownership badge',
  'AssessmentPage missing or not properly defined'
);

// 5. Check RecommendationPage.jsx & RecommendationDashboard.jsx
const recommendationPath = path.resolve(__dirname, '../../frontend/src/pages/RecommendationPage.jsx');
const recommendationSrc = fs.existsSync(recommendationPath) ? fs.readFileSync(recommendationPath, 'utf8') : '';
const recDashboardPath = path.resolve(__dirname, '../../frontend/src/features/recommendations/RecommendationDashboard.jsx');
const recDashboardSrc = fs.existsSync(recDashboardPath) ? fs.readFileSync(recDashboardPath, 'utf8') : '';
assert(
  recommendationSrc.includes('export default function RecommendationPage') &&
  recommendationSrc.includes('RecommendationDashboard') &&
  recDashboardSrc.includes('economicReturn') &&
  recDashboardSrc.includes('soilRestoration') &&
  recDashboardSrc.includes('waterResilience'),
  'RecommendationPage.jsx connects RecommendationDashboard with 3 strategic pathways',
  'RecommendationPage missing or not properly defined'
);

// 6. Check TransparencyPage.jsx & TransparencyDashboard.jsx
const transparencyPath = path.resolve(__dirname, '../../frontend/src/pages/TransparencyPage.jsx');
const transparencySrc = fs.existsSync(transparencyPath) ? fs.readFileSync(transparencyPath, 'utf8') : '';
const transDashboardPath = path.resolve(__dirname, '../../frontend/src/features/transparency/TransparencyDashboard.jsx');
const transDashboardSrc = fs.existsSync(transDashboardPath) ? fs.readFileSync(transDashboardPath, 'utf8') : '';
assert(
  transparencySrc.includes('export default function TransparencyPage') &&
  transparencySrc.includes('TransparencyDashboard') &&
  transDashboardSrc.includes('ProvenanceSection') &&
  transDashboardSrc.includes('ScoringModelExplainer'),
  'TransparencyPage.jsx connects TransparencyDashboard with open-science disclosures',
  'TransparencyPage missing or not properly defined'
);

// 7. Check App.jsx routing
const appPath = path.resolve(__dirname, '../../frontend/src/App.jsx');
const appSrc = fs.existsSync(appPath) ? fs.readFileSync(appPath, 'utf8') : '';
assert(
  appSrc.includes('AppLayout') &&
  appSrc.includes('AssessmentPage') &&
  appSrc.includes('RecommendationPage') &&
  appSrc.includes('TransparencyPage') &&
  appSrc.includes('hashchange') &&
  appSrc.includes('prediction'),
  'App.jsx implements hash routing with AppLayout and fallback handling',
  'App.jsx routing incomplete'
);

// 8. Check LandingPage.jsx does not duplicate Navbar/Footer
const landingPath = path.resolve(__dirname, '../../frontend/src/pages/LandingPage.jsx');
const landingSrc = fs.existsSync(landingPath) ? fs.readFileSync(landingPath, 'utf8') : '';
assert(
  !landingSrc.includes('<Navbar') &&
  !landingSrc.includes('<Footer') &&
  landingSrc.includes('HeroSection') &&
  landingSrc.includes('Map3DSection'),
  'LandingPage.jsx cleanly renders section contents without duplicating Navbar/Footer',
  'LandingPage still contains duplicate Navbar/Footer'
);

console.log(`\n========================================`);
console.log(`LAYOUT & ROUTING AUDIT: ${passCount} / ${totalCount} CHECKS PASSED`);
console.log(`========================================`);

if (passCount !== totalCount) {
  process.exit(1);
}
