# InternPredict 

-resume analyzer and internship readiness predictor for students.

InternPredict AI helps students evaluate their resumes against ATS standards, discover skill gaps, and estimate their probability of landing an internship using a machine learning-inspired prediction model.

---

## Features

- **Resume Analyzer** — Paste your resume text and get an instant ATS compatibility score, keyword match analysis, detected skills, and improvement recommendations.
- **Internship Predictor** — Enter your CGPA, skills count, projects, certifications, and more to get a data-driven selection probability with a Random Forest-inspired model.
- **Student Dashboard** — Track your readiness score over time, view career insights, monitor skill progress, and review recent activity.
- **Skills Overview** — Visualize proficiency across 5 skill categories with industry demand indicators.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | shadcn/ui, Radix UI |
| Charts | Recharts |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| API Client | TanStack React Query (Orval-generated hooks) |
| Backend | Express 5, Node.js 24, TypeScript |
| Validation | Zod (OpenAPI-generated schemas) |
| API Contract | OpenAPI 3.1 (contract-first) |
| Monorepo | pnpm workspaces |

---

## Project Structure

```
├── artifacts/
│   ├── intern-predict/          # React + Vite frontend
│   │   └── src/
│   │       ├── pages/           # Landing, Analyze, Predict, Dashboard
│   │       ├── components/      # Shared UI components
│   │       └── index.css        # Theme (dark-first, cyan accent)
│   └── api-server/              # Express 5 backend
│       └── src/
│           └── routes/
│               ├── resume.ts    # POST /api/resume/analyze
│               ├── predict.ts   # POST /api/predict/internship
│               └── dashboard.ts # GET /api/dashboard/summary, /skills/categories
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml         # Single source of truth for API contracts
│   ├── api-client-react/        # Generated React Query hooks (Orval)
│   └── api-zod/                 # Generated Zod validation schemas (Orval)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install dependencies

```bash
pnpm install
```

### Run in development

```bash
# Start the API server (port 5000)
pnpm --filter @workspace/api-server run dev

# Start the frontend (in a separate terminal)
pnpm --filter @workspace/intern-predict run dev
```

Visit `http://localhost:<PORT>` in your browser.

### Regenerate API client (after spec changes)

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Typecheck all packages

```bash
pnpm run typecheck
```

---

## API Reference

All endpoints are prefixed with `/api`.

### `POST /api/resume/analyze`

Analyze resume text and return ATS scores, keyword matches, and skill detection.

**Request body:**
```json
{
  "resumeText": "string (required)",
  "targetRole": "string (optional) — e.g. 'Software Engineer', 'Data Scientist'"
}
```

**Response:** ATS score, format score, keyword score, skills score, keyword matches, detected skills, missing keywords, recommendations, strengths.

---

### `POST /api/predict/internship`

Predict internship selection probability using a weighted ensemble model.

**Request body:**
```json
{
  "cgpa": 8.2,
  "skillsCount": 12,
  "projectsCount": 4,
  "certificationsCount": 2,
  "internshipsCount": 1,
  "hackathonsCount": 3
}
```

**Response:** Probability (0–100%), readiness grade (A+/A/B+/B/C/D), factor importance breakdown, improvement tips, similar company profiles.

---

### `GET /api/dashboard/summary`

Returns aggregated student dashboard data — readiness score, career insights, progress cards, recent activity.

---

### `GET /api/skills/categories`

Returns skill proficiency data across 5 categories: Programming Languages, Frameworks & Libraries, ML & AI, Databases, DevOps & Cloud.

---

## ML Model

The internship predictor uses a Random Forest-inspired weighted ensemble model implemented in TypeScript:

| Feature | Weight |
|---------|--------|
| CGPA | 30% |
| Technical Skills Count | 25% |
| Projects Count | 20% |
| Certifications Count | 12% |
| Prior Internships | 8% |
| Hackathons | 5% |

Each feature is normalized through calibrated sigmoid-like functions and combined into a weighted probability score (range: 20–95%).

---

## License

MIT
