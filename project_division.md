# AgriShift — Complete Project Team Division & Development Ownership

We need to officially divide the ENTIRE AgriShift project among four team members:

1. Talha
2. Shahzaman
3. Faiza
4. Anaya

This division must cover the complete project lifecycle, including research, datasets, data processing, database, backend, frontend, recommendation engine, testing, deployment, documentation and NASA Space Apps presentation.

**Important special requirement:** Talha must also develop the initial frontend foundation before Shahzaman and Faiza start their individual frontend modules. Talha should not own the entire frontend. He will establish the shared UI structure, and the other members will build on it independently.

First inspect the actual project structure and existing implementation. Do not recreate completed work unnecessarily.

---

# PART 1 — OFFICIAL TEAM RESPONSIBILITIES

## 1. TALHA — Project Lead, Backend, Recommendation Engine & Frontend Foundation

**Role:** Technical Lead and Full Stack Developer.

Talha owns the core technical architecture, backend, recommendation engine, initial frontend setup and final integration.

### A. Backend & Database
- Maintain MongoDB Atlas connection.
- Maintain database models and schemas.
- Maintain Express server and API architecture.
- Maintain recommendation controllers and routes.
- Maintain input validation.
- Verify database queries and data integrity.
- Handle backend errors and security.
- Ensure APIs return consistent response structures.

### B. Hybrid Recommendation Engine
- Maintain eligibility engine.
- Maintain yield scoring.
- Maintain climate scoring.
- Maintain crop rotation logic.
- Maintain Economic Return pathway.
- Maintain Soil Restoration pathway.
- Maintain Water Resilience pathway.
- Maintain composite scoring and explanations.
- Ensure scientific limitations are disclosed.
- Test all recommendation pathways.

### C. Frontend Foundation — Must Be Completed First

Before Shahzaman and Faiza start feature development, Talha must create the shared frontend foundation.

Tasks:
- Inspect the existing React frontend.
- Establish the main application layout.
- Establish the navigation and routing structure.
- Establish the global theme, colors and typography.
- Create reusable buttons, cards, inputs and layout components.
- Create a reusable header and navigation.
- Create a reusable page container.
- Establish global responsive CSS.
- Create the centralized API client.
- Configure frontend environment variables.
- Establish common loading, error and empty-state components.
- Create placeholder routes/pages for assessment, recommendations and transparency.
- Document how other members should use the shared components.

**Important:** Talha should build the basic foundation only. He must not implement Shahzaman's complete assessment module or Faiza's complete recommendation dashboard.

### D. Integration & Deployment
- Maintain backend/frontend integration.
- Verify API contracts.
- Integrate individual feature modules.
- Resolve integration conflicts.
- Manage final build.
- Coordinate deployment.
- Verify the complete application.

### File Ownership

Backend:
- `backend/src/config/`
- `backend/src/models/`
- `backend/src/services/`
- `backend/src/controllers/`
- `backend/src/routes/`
- `backend/src/validators/`

Frontend foundation:
- `frontend/src/App.jsx` or existing equivalent.
- Main routing files.
- Global styles and theme.
- Shared components.
- Centralized API client.
- Frontend configuration.

Talha owns shared configuration files and final integration.

---

## 2. SHAHZAMAN — Agricultural Data Engineering & Assessment Wizard

**Role:** Data Engineer and Frontend Developer.

Shahzaman owns the agricultural data pipeline and the farmer assessment experience.

### A. Agricultural Data Engineering

- Understand FAO/IIASA GAEZ v5 data.
- Verify crop dataset coverage.
- Verify country coverage.
- Verify historical yield and suitability fields.
- Verify irrigated and rainfed datasets.
- Maintain raw dataset organization.
- Maintain data cleaning and normalization scripts.
- Validate missing values and duplicates.
- Validate data types and units.
- Verify NASA POWER climate profiles.
- Document data preprocessing.
- Coordinate data import requirements with Talha.
- Ensure source data is reproducible.

Do not overwrite the existing normalized datasets without a verified reason.

### B. Farmer Assessment Wizard

After Talha completes the frontend foundation:

- Build the assessment form.
- Country dropdown using countries API.
- Current crop dropdown using crops API.
- Water regime selection: Irrigated / Rainfed.
- Management level selection: High / Low.
- Optional climate archetype selection.
- Input validation.
- Clear validation messages.
- Submit assessment to recommendation API.
- Loading and error states.
- Ensure a user can easily complete the assessment.

### C. User Experience
- Make the form responsive.
- Use Talha's shared components.
- Maintain the existing visual identity.
- Do not modify global styles independently.

### File Ownership
- `dataset/raw/`
- `dataset/processed/` for data-processing outputs.
- `dataset/scripts/` for acquisition, audit and normalization scripts.
- `frontend/src/features/assessment/`
- Assessment-specific components and styles.

Do not modify backend models, seed scripts or recommendation services without coordinating with Talha.

---

## 3. FAIZA — Recommendation Dashboard & Data Visualization

**Role:** Frontend Developer — Recommendation Results.

Faiza owns the complete recommendation results experience.

### A. Economic Return Pathway
- Recommendation card.
- Recommended crop.
- Composite score.
- Attainable yield (kg/ha).
- Land coverage.
- Score breakdown.
- Rotation explanation.

### B. Soil Restoration Pathway
- Recommended crop or legume.
- Nitrogen fixation explanation where applicable.
- Crop rotation transition type.
- Score breakdown.
- Scientific limitations.
- Explanation of why the crop is recommended.

### C. Water Resilience Pathway
- Recommended alternative crop.
- Water requirement rating.
- Drought tolerance.
- Available precipitation and temperature indicators.
- Score breakdown.
- Climate compatibility explanation.

### D. Dashboard & Visualizations
- Three pathway comparison cards.
- Composite score gauges or charts.
- Yield visualization.
- Climate summary.
- Crop comparison.
- Clear recommendation explanations.
- Loading, error and empty states.
- Responsive desktop and mobile layouts.

### E. API Integration
- Use the centralized API client created by Talha.
- Consume the agreed recommendation response structure.
- Do not hardcode recommendation results.
- Handle missing optional data.
- Do not invent climate or yield indicators.

### File Ownership
- `frontend/src/features/recommendations/`
- Recommendation cards.
- Recommendation charts and visualizations.
- Recommendation-specific styles and tests.

Use Talha's shared layout, theme and components. Do not modify Shahzaman's assessment files.

---

## 4. ANAYA — Agricultural Research, Scientific Validation, Transparency, QA & Documentation

**Role:** Research, Quality Assurance and Documentation Lead.

Anaya owns scientific validation, transparency and final project documentation.

### A. Agricultural Research
- Research crop rotation principles.
- Research cereal-to-legume rotations.
- Research soybean and biological nitrogen fixation.
- Research drought-tolerant crops, especially sorghum.
- Research water requirements and crop suitability.
- Verify claims against credible agricultural sources.
- Maintain a list of references and source links.

### B. Scientific Transparency
- Explain GAEZ v5 methodology.
- Explain NASA POWER climate data.
- Explain the difference between modeled yield potential and actual harvest.
- Explain the limitations of benchmark climate profiles.
- Explain why soil fertility is not directly measured by the currently integrated datasets.
- Ensure no unsupported agricultural claims are displayed.
- Prepare transparency content for the frontend.

### C. Transparency Frontend
- Create a data sources section.
- Create methodology explanations.
- Create scientific limitations section.
- Display data provenance.
- Explain recommendation scoring in understandable language.
- Explain uncertainty and missing-data handling.

### D. Quality Assurance
- Prepare test cases.
- Test all three recommendation pathways.
- Test different countries and crops.
- Test invalid inputs.
- Test missing climate and yield data.
- Test zero vs missing values.
- Test recommendation explanations.
- Test the complete farmer journey.
- Test mobile responsiveness.
- Report bugs with steps to reproduce.
- Verify fixes with the responsible developer.

### E. Documentation & Presentation
- Maintain project architecture diagrams.
- Maintain data flow diagrams.
- Prepare user guide.
- Prepare technical documentation.
- Organize screenshots.
- Prepare NASA Space Apps presentation.
- Prepare final demo script.
- Document each member's contributions.
- Prepare final submission materials.

### File Ownership
- `frontend/src/features/transparency/`
- `docs/`
- `dataset/reports/`
- QA reports and presentation materials.

Anaya should report bugs to the relevant owner instead of directly editing their implementation files.

---

# PART 2 — COMPLETE PROJECT COVERAGE

Create a master responsibility matrix covering every project phase.

| Project Phase | Primary Owner | Supporting Member |
|---|---|---|
| NASA challenge research and problem understanding | Anaya | Talha |
| Agricultural research | Anaya | Shahzaman |
| GAEZ v5 data acquisition | Shahzaman | Anaya |
| NASA POWER data acquisition | Shahzaman | Anaya |
| Data cleaning and normalization | Shahzaman | Talha |
| Data quality audits | Shahzaman | Anaya |
| Database schema and MongoDB integration | Talha | Shahzaman |
| Backend API architecture | Talha | — |
| Eligibility engine | Talha | Anaya |
| Yield scoring | Talha | Shahzaman |
| Climate scoring | Talha | Shahzaman |
| Crop rotation engine | Talha | Anaya |
| Economic Return pathway | Talha | Anaya |
| Soil Restoration pathway | Talha | Anaya |
| Water Resilience pathway | Talha | Anaya |
| Frontend foundation and shared layout | Talha | — |
| Assessment Wizard | Shahzaman | Talha |
| Recommendation Dashboard | Faiza | Talha |
| Score visualizations | Faiza | Anaya |
| Transparency interface | Anaya | Talha |
| Frontend/backend integration | Talha | Shahzaman, Faiza |
| Functional testing | Anaya | All members |
| Scientific validation | Anaya | Shahzaman |
| Deployment | Talha | All members |
| User documentation | Anaya | Shahzaman |
| Final presentation and demo | Anaya | All members |

This table must be refined based on actual existing project files and work already completed.

---

# PART 3 — DEVELOPMENT ORDER AND DEPENDENCIES

## Stage 1: Existing Work Verification

Talha:
- Verify backend and database.
- Verify recommendation engine.
- Publish stable API request/response contract.

Shahzaman:
- Audit datasets.
- Verify normalization and data sources.
- Document data pipeline.

Faiza:
- Inspect API response structure.
- Prepare recommendation dashboard component plan.
- Start building independent UI components after Talha shares the contract.

Anaya:
- Complete agricultural research.
- Prepare scientific references.
- Prepare QA checklist and transparency content.

## Stage 2: Frontend Foundation

Talha must complete:
- Routing.
- Global theme.
- Shared components.
- Navigation.
- API client.
- Placeholder pages.
- Responsive foundation.

Then hand over the frontend foundation to Shahzaman and Faiza.

## Stage 3: Parallel Feature Development

Shahzaman:
- Complete Assessment Wizard.

Faiza:
- Complete Recommendation Dashboard.

Anaya:
- Complete Transparency module and test scenarios.

Talha:
- Continue backend improvements and integration preparation.

## Stage 4: Integration

- Connect Shahzaman's assessment form to the backend.
- Connect Faiza's dashboard to the recommendation API.
- Integrate Anaya's transparency section.
- Talha resolves shared integration issues.
- Anaya validates the complete flow.

## Stage 5: Final Delivery

- Complete functional testing.
- Fix critical bugs.
- Verify scientific accuracy.
- Test responsive layouts.
- Deploy frontend and backend.
- Prepare final documentation.
- Prepare demo and NASA Space Apps submission.

---

# PART 4 — CONFLICT PREVENTION

These rules are mandatory:

1. Each member must have a separate Git branch.
2. No direct commits to `main`.
3. No two members should own the same feature folder.
4. Talha controls shared frontend configuration and backend integration.
5. Shahzaman owns assessment feature files.
6. Faiza owns recommendation feature files.
7. Anaya owns transparency and documentation files.
8. Shared files require coordination before editing.
9. Do not create duplicate components or API clients.
10. Do not overwrite completed dataset or backend work unnecessarily.
11. Use actual API data, never fabricated recommendation results.
12. Each member must test their own module before integration.
13. Changes must be reviewed before merging.

---

# PART 5 — DOCUMENTATION TO CREATE OR UPDATE

Create or update:

1. `TEAM_DIVISION.md`
   - Complete team responsibilities.
   - File ownership.
   - Completed and pending work ownership.
   - Dependencies and workflow.

2. `docs/TEAM_TASK_TRACKER.md`
   - Task ID.
   - Task name.
   - Primary owner.
   - Supporting member.
   - Status.
   - Dependencies.
   - Files involved.
   - Acceptance criteria.

3. `PROJECT_PROGRESS.md`
   - Update overall project progress.
   - Preserve all previous completed work.

4. `dataset/reports/EXECUTION_LOG.md`
   - Log the team division update.

5. `dataset/reports/NEXT_STEPS.md`
   - Record the next tasks for all four members.

Do not erase previous logs or reports.

---

# PART 6 — FINAL RESPONSE

After making the changes, provide:

- Complete responsibilities of all four members.
- All completed work and its owner.
- All pending work and its owner.
- File/folder ownership.
- Dependencies between members.
- Which tasks can run in parallel.
- Which tasks must happen sequentially.
- Individual deliverables.
- Project-wide completion checklist.

**Most important:** Talha must build the frontend foundation first, then Shahzaman and Faiza independently develop their feature modules. Anaya independently handles research, transparency, QA and documentation.

The division must cover the entire AgriShift project from initial research to final NASA Space Apps presentation. Ensure work is balanced, responsibilities are clear and file conflicts are minim