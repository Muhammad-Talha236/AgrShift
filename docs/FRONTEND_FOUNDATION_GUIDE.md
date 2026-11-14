# AgriShift — Frontend Foundation & Developer Integration Guide

**Owner & Lead Architect:** Talha (Project Lead & Full Stack Developer)  
**Target Audience:** Shahzaman (Assessment Wizard), Faiza (Recommendation Dashboard), Anaya (Transparency & QA)  
**Location:** [frontend/src/](file:///d:/Uni%20projects/AgrShift/frontend/src/)

---

## 1. Overview & Architecture Philosophy

The AgriShift frontend is built on **React (Vite)** with **Tailwind CSS v4**. To ensure visual consistency, maintainability, and rapid feature development across all team members, the architecture is strictly split into:

1. **Shared Frontend Foundation (Owned by Talha):** Universal layout (`AppLayout`), client-side hash routing, design system tokens, 9 reusable UI components, and the centralized API service.
2. **Feature Modules (Owned by Respective Members):** Isolated domains for Farmer Assessment ([Shahzaman](file:///d:/Uni%20projects/AgrShift/project_division.md#2-shahzaman--agricultural-data-engineering--assessment-wizard)), Recommendation Dashboard ([Faiza](file:///d:/Uni%20projects/AgrShift/project_division.md#3-faiza--recommendation-dashboard--data-visualization)), and Scientific Transparency ([Anaya](file:///d:/Uni%20projects/AgrShift/project_division.md#4-anaya--agricultural-research-scientific-validation-transparency-qa--documentation)).

> [!IMPORTANT]
> **Anti-Duplication Principle:** Feature owners must never create duplicate buttons, cards, inputs, alerts, or custom `fetch`/`axios` calls. All team members must consume the shared components and services documented below.

---

## 2. Directory Structure

```text
frontend/
├── .env                              # Local environment variables
├── .env.example                      # Template for environment configuration
├── index.html                        # HTML shell loading Inter & Plus Jakarta Sans
├── package.json                      # React 19, Tailwind CSS v4, MapLibre GL
├── vite.config.js                    # Vite bundler configuration
└── src/
    ├── App.jsx                       # Root application component & hash router
    ├── main.jsx                      # React DOM mounting entry point
    ├── index.css                     # Global styles, color tokens & typography
    ├── components/
    │   ├── common/                   # Reusable atomic UI components (Talha)
    │   │   ├── Alert.jsx             # Status messages, error banners & notices
    │   │   ├── Badge.jsx             # Pill tags (success, warning, info, danger)
    │   │   ├── Button.jsx            # Standardized interactive buttons
    │   │   ├── Card.jsx              # Surface containers with subtle borders
    │   │   ├── EmptyState.jsx        # Fallback views when data is absent
    │   │   ├── Icons.jsx             # Curated SVG icons (Leaf, Globe, etc.)
    │   │   ├── Input.jsx             # Accessible labeled input fields
    │   │   ├── LoadingSpinner.jsx    # Animated loading indicators
    │   │   ├── PageContainer.jsx     # Centering container with standard padding
    │   │   └── Select.jsx            # Standardized accessible select dropdowns
    │   ├── landing/                  # Landing page sections (Hero, Map, Showcase, CTA)
    │   └── layout/                   # Universal structural components
    │       ├── AppLayout.jsx         # Unified layout frame (Navbar + Content + Footer)
    │       ├── Navbar.jsx            # Floating header bar with route indicators
    │       └── Footer.jsx            # Persistent SaaS footer
    ├── features/                     # Team feature modules (Isolated domains)
    │   ├── assessment/               # [Shahzaman] Farmer assessment wizard & inputs
    │   ├── recommendations/          # [Faiza] Multi-pathway dashboard & charts
    │   └── transparency/             # [Anaya] Scientific disclosures & citations
    ├── pages/                        # Page orchestrators
    │   ├── AssessmentPage.jsx        # Route view for #assessment
    │   ├── LandingPage.jsx           # Route view for #home
    │   ├── RecommendationPage.jsx    # Route view for #recommendation
    │   └── TransparencyPage.jsx      # Route view for #transparency
    └── services/
        └── api.js                    # Centralized API service with fallbacks
```

---

## 3. Application Entry Point & Client-Side Routing

The routing architecture resides in [frontend/src/App.jsx](file:///d:/Uni%20projects/AgrShift/frontend/src/App.jsx). It utilizes browser **native hash routing** without external heavy router dependencies. This provides full support for browser back/forward buttons, bookmarkable URLs, and instant rendering.

### Supported Routes

| Route Hash | Active Component | Responsible Owner | Purpose |
|---|---|---|---|
| `#home` (or empty) | `<LandingPage />` | Talha (Foundation) | Public landing page, 3D land map & mission |
| `#assessment` | `<AssessmentPage />` | Shahzaman | Land parameters & crop input wizard |
| `#recommendation` | `<RecommendationPage />` | Faiza | Three strategic rotation pathways & comparison |
| `#transparency` | `<TransparencyPage />` | Anaya | GAEZ v5, NASA POWER & scientific caveats |
| `#prediction` | *Redirected* | Talha (Backward Compatibility) | Automatically maps to `#assessment` |

### AppLayout Wrapping

All pages are rendered within [AppLayout.jsx](file:///d:/Uni%20projects/AgrShift/frontend/src/components/layout/AppLayout.jsx):

```jsx
// src/App.jsx
import AppLayout from './components/layout/AppLayout';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  // ... hashchange listener ...

  return (
    <AppLayout activePage={currentPage} onNavigate={navigateTo}>
      {currentPage === 'home' && <LandingPage onNavigate={navigateTo} />}
      {currentPage === 'assessment' && <AssessmentPage onNavigate={navigateTo} />}
      {currentPage === 'recommendation' && <RecommendationPage onNavigate={navigateTo} />}
      {currentPage === 'transparency' && <TransparencyPage onNavigate={navigateTo} />}
    </AppLayout>
  );
}
```

> [!NOTE]
> **Page Container Rule:** Feature pages (`AssessmentPage`, `RecommendationPage`, `TransparencyPage`) must **NOT** import or render `<Navbar>` or `<Footer>`. `AppLayout` provides them universally.

---

## 4. Design System & Global Theme

Defined in [frontend/src/index.css](file:///d:/Uni%20projects/AgrShift/frontend/src/index.css):

### Color Tokens

- **Forest Green (Primary Brand):** `#245B3C` (Buttons, key accents, focus rings)
- **Deep Forest Green (Dark Surface/Text):** `#173D2A` (Headings, active states)
- **Soft Mint (Light Backgrounds):** `#EAF2E9` (Pill badges, subtle highlights)
- **Off-White (Page Canvas):** `#F8FAF7` (Universal application body)
- **Charcoal Text:** `#202820` (Body typography)

### Typography

- **Headings (`h1`, `h2`, `h3`, `h4`):** `'Plus Jakarta Sans', 'Inter', sans-serif`
- **Body & Controls:** `'Inter', system-ui, sans-serif`

---

## 5. Shared Component Library

All shared components are located in [frontend/src/components/common/](file:///d:/Uni%20projects/AgrShift/frontend/src/components/common/).

### 1. `PageContainer`

Centers page content, applies consistent responsive horizontal padding, and controls layout width.

- **Props:**
  - `size`: `'sm'` (3xl / forms), `'md'` (5xl / articles), `'lg'` (7xl / dashboards - default), `'xl'` (1400px), `'full'`
  - `className`: Optional extra Tailwind classes
  - `children`: Content to wrap

```jsx
import PageContainer from '../components/common/PageContainer';

export default function MyPage() {
  return (
    <PageContainer size="md" className="pt-28 pb-16">
      <h1>Page Title</h1>
    </PageContainer>
  );
}
```

### 2. `Card`

Standardized elevated white surface container with soft emerald borders and rounded corners.

- **Props:**
  - `hoverable`: `boolean` (adds hover lift and shadow elevation; default `false`)
  - `className`: Custom utility classes (e.g., padding override)
  - `children`: Card contents

```jsx
import Card from '../components/common/Card';

<Card hoverable className="p-6">
  <h3 className="font-bold text-[#173D2A]">Card Title</h3>
  <p className="text-sm text-[#202820]/75">Card body content...</p>
</Card>
```

### 3. `Button`

Interactive button component supporting 4 variants, 3 sizes, and native loading spinner states.

- **Props:**
  - `variant`: `'primary'` (default forest green), `'secondary'` (mint green), `'outline'` (bordered white), `'ghost'`
  - `size`: `'sm'`, `'md'` (default), `'lg'`
  - `loading`: `boolean` (displays integrated spinner and disables button)
  - `disabled`: `boolean`
  - `onClick`: Event handler callback
  - `type`: `'button'` (default), `'submit'`, `'reset'`

```jsx
import Button from '../components/common/Button';

<Button variant="primary" size="md" onClick={handleSubmit} loading={isSubmitting}>
  Submit Assessment
</Button>

<Button variant="outline" size="sm" onClick={() => onNavigate('home')}>
  Cancel
</Button>
```

### 4. `Input`

Fully accessible text input with label, required asterisk, and error validation feedback.

- **Props:**
  - `label`: `string`
  - `required`: `boolean` (adds red indicator)
  - `error`: `string` (renders error text and highlights border in red)
  - `helperText`: `string` (subtle helper text shown when no error exists)
  - Standard HTML input props: `value`, `onChange`, `placeholder`, `type`, etc.

```jsx
import Input from '../components/common/Input';

<Input
  label="Target Cropland Area (Hectares)"
  type="number"
  value={area}
  onChange={(e) => setArea(e.target.value)}
  helperText="Optional field for harvest scaling"
  error={errors.area}
  required
/>
```

### 5. `Select`

Accessible dropdown select with custom chevron arrow and consistent styling.

- **Props:**
  - `label`: `string`
  - `options`: `Array<{ value: string, label: string }>`
  - `value`: Current selected value
  - `onChange`: Change handler
  - `placeholder`: Default unselected option text (e.g. `'Select a Country'`)
  - `error`: `string`
  - `required`: `boolean`

```jsx
import Select from '../components/common/Select';

<Select
  label="Country of Cultivation"
  placeholder="Choose a sovereign country..."
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
  options={[
    { value: 'PAK', label: 'Pakistan' },
    { value: 'USA', label: 'United States' },
  ]}
  error={errors.country}
  required
/>
```

### 6. `Badge`

Status tag pills for metadata, ratings, and module tags.

- **Props:**
  - `variant`: `'success'` (mint - default), `'info'` (sky blue), `'warning'` (amber), `'danger'` (rose), `'neutral'` (gray)
  - `children`: Label text or badge contents

```jsx
import Badge from '../components/common/Badge';

<Badge variant="success">Engine Ready</Badge>
<Badge variant="warning">Module in Development</Badge>
```

### 7. `Alert`

Contextual banner for validation summaries, backend error notices, and scientific disclaimers.

- **Props:**
  - `variant`: `'info'` (default), `'success'`, `'warning'`, `'error'`
  - `title`: Optional bold banner heading
  - `message`: Description text (or pass arbitrary JSX via `children`)
  - `dismissible`: `boolean` (shows close button; default `false`)
  - `onDismiss`: Callback triggered when dismissed

```jsx
import Alert from '../components/common/Alert';

<Alert
  variant="warning"
  title="Scientific Notice"
  message="Attainable yields are modeled benchmarks and do not replace localized soil testing."
  dismissible
/>
```

### 8. `LoadingSpinner`

Centered animated SVG spinner with optional status message.

- **Props:**
  - `size`: `'sm'`, `'md'` (default), `'lg'`
  - `message`: `string` (e.g. `'Evaluating GAEZ v5 suitability matrices...'`)

```jsx
import LoadingSpinner from '../components/common/LoadingSpinner';

if (isLoading) {
  return <LoadingSpinner size="lg" message="Computing agro-ecological suitability..." />;
}
```

### 9. `EmptyState`

Standardized zero-state screen for empty search results, uninitiated evaluations, or ineligible parameters.

- **Props:**
  - `title`: Main heading
  - `description`: Explanatory subtitle
  - `icon`: Optional custom SVG icon node
  - `actionLabel`: Label for recovery action button
  - `onAction`: Function executed when button is clicked

```jsx
import EmptyState from '../components/common/EmptyState';

<EmptyState
  title="No Recommendations Generated"
  description="No crops met the agro-ecological threshold for this selected regime."
  actionLabel="Adjust Parameters"
  onAction={() => setStep(1)}
/>
```

---

## 6. Centralized API Service

Located at [frontend/src/services/api.js](file:///d:/Uni%20projects/AgrShift/frontend/src/services/api.js).

All network calls use the base URL configured via `VITE_API_BASE_URL` (default: `http://localhost:5000/api`).

### Available Functions

```javascript
import {
  fetchCountries,        // GET /api/recommendations/countries
  fetchCropsCatalog,     // GET /api/recommendations/crops
  getRecommendations,    // POST /api/recommendations
  checkBackendHealth,    // GET /api/health
  fetchLandingContent,   // GET /api/landing
  fetchCropsShowcase,    // GET /api/crops
  fetchMapConfig,        // GET /api/map/config
} from '../services/api';
```

### Example Usage in Feature Modules

```javascript
// Fetching countries for dropdown (Shahzaman)
const countries = await fetchCountries();
// Returns: [{ iso3: 'PAK', name: 'Pakistan', availableSlices: 32 }, ...]

// Fetching crop catalog (Shahzaman)
const crops = await fetchCropsCatalog();
// Returns: [{ cropId: 'wheat', displayName: 'Wheat', category: 'Cereal / Rabi Grain' }, ...]

// Submitting assessment (Faiza / Shahzaman)
const response = await getRecommendations({
  country: 'PAK',
  currentCrop: 'wheat',
  waterRegime: 'irrigated',
  managementLevel: 'high'
});
// Returns: { status: 'SUCCESS', assessmentSummary: {...}, pathways: {...}, ... }
```

---

## 7. Developer Team Integration Guide

Per the authoritative [project_division.md](file:///d:/Uni%20projects/AgrShift/project_division.md):

### For Shahzaman (Farmer Assessment Wizard)
- **Assigned Directory:** `frontend/src/features/assessment/`
- **Main View File:** [frontend/src/pages/AssessmentPage.jsx](file:///d:/Uni%20projects/AgrShift/frontend/src/pages/AssessmentPage.jsx)
- **Integration Steps:**
  1. Build the multi-step form inside `frontend/src/features/assessment/AssessmentWizard.jsx`.
  2. Populate Country dropdown using `fetchCountries()`.
  3. Populate Current Crop dropdown using `fetchCropsCatalog()`.
  4. Use `Select` and `Input` components with validation state.
  5. Upon submit, call `getRecommendations(formData)` and navigate to `#recommendation` with results.
  6. Replace the placeholder content in `AssessmentPage.jsx` with `<AssessmentWizard />`.

### For Faiza (Recommendation Dashboard & Visualizations)
- **Assigned Directory:** `frontend/src/features/recommendations/`
- **Main View File:** [frontend/src/pages/RecommendationPage.jsx](file:///d:/Uni%20projects/AgrShift/frontend/src/pages/RecommendationPage.jsx)
- **Integration Steps:**
  1. Build pathway cards in `frontend/src/features/recommendations/PathwayCard.jsx`.
  2. Build comparison visualizers and score breakdowns using `Card`, `Badge`, and charts.
  3. Consume the three pathways from the API: `pathways.economicReturn`, `pathways.soilRestoration`, `pathways.waterResilience`.
  4. Display `EmptyState` when `status === 'NO_ELIGIBLE_CROPS'`.
  5. Replace the placeholder content in `RecommendationPage.jsx` with your `<RecommendationDashboard />`.

### For Anaya (Scientific Validation & Transparency)
- **Assigned Directory:** `frontend/src/features/transparency/`
- **Main View File:** [frontend/src/pages/TransparencyPage.jsx](file:///d:/Uni%20projects/AgrShift/frontend/src/pages/TransparencyPage.jsx)
- **Integration Steps:**
  1. Create transparency sections in `frontend/src/features/transparency/ProvenanceSection.jsx`.
  2. Document GAEZ v5 baseline assumptions, NASA POWER climate variables, and rotation formulas.
  3. Include scientific caveat modals and reference citations.
  4. Replace the placeholder content in `TransparencyPage.jsx` with `<TransparencyView />`.

---

## 8. Running & Building the Frontend

### Prerequisites
- Node.js (v18+ recommended)
- Backend running on port 5000 (or configured via `.env`)

### Local Development
```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
The app will be available at `http://localhost:5173`.

### Production Build
```bash
# Run Vite production build and check for type/syntax errors
npm run build
```
Build assets will be emitted cleanly to `frontend/dist/`.
