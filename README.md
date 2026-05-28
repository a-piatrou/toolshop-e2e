# toolshop-e2e

UI and API test suite for the [Practice Software Testing](https://practicesoftwaretesting.com)
shop (the "Toolshop" demo), written with Playwright and TypeScript.

[![e2e](https://github.com/a-piatrou-godeltech/toolshop-e2e/actions/workflows/ci.yml/badge.svg)](https://github.com/a-piatrou-godeltech/toolshop-e2e/actions/workflows/ci.yml)

I keep this around as a working reference for the way I like to structure browser
automation: a thin page-object layer, fixtures that own setup, API-driven test
data, schema-checked API tests, and everything running on a sharded CI pipeline.
The target is a public demo app, so the whole thing is runnable by anyone who
clones it — no credentials or local backend required.

## Stack

- **Playwright Test** (TypeScript, strict mode)
- **Zod** — response/contract validation for the API layer
- **Faker** — disposable users and test data
- **ESLint** (flat config) + **Prettier**
- **GitHub Actions** — lint/typecheck gate, sharded runs, merged HTML report

## Layout

```
src/
  api/        ToolshopApi client + Zod response schemas
  data/       Faker-based factories (users, addresses)
  fixtures/   the `test`/`expect` everything imports
  pages/      page objects (+ components/ for shared UI like the navbar)
  utils/      environment configuration
tests/
  api/        endpoint + contract tests (project: api)
  ui/         end-to-end browser tests (project: chromium)
```

## Getting started

```bash
npm ci
npx playwright install --with-deps chromium

# defaults already point at the public demo; copy only if you want to override
cp .env.example .env

npm test            # everything
npm run test:api    # API project only
npm run test:ui     # browser project only
npm run test:smoke  # @smoke subset
npm run report      # open the last HTML report
```

## Scripts

| Script                | What it does                     |
| --------------------- | -------------------------------- |
| `npm test`            | run the full suite               |
| `npm run test:ui`     | browser tests (chromium project) |
| `npm run test:api`    | API tests (api project)          |
| `npm run test:smoke`  | only tests tagged `@smoke`       |
| `npm run test:headed` | run the browser tests headed     |
| `npm run lint`        | ESLint                           |
| `npm run typecheck`   | `tsc --noEmit`                   |
| `npm run format`      | Prettier (write)                 |

## How it's put together

**Two projects, one config.** The `api` project talks straight to the REST API
(no browser); the `chromium` project drives the UI. They share base settings but
get their own `baseURL`. Tags (`@smoke`, `@api`, `@regression`) make it easy to
slice the suite — CI shards the UI project and runs the API project on its own.

**Page objects stay thin.** They expose locators and intent-level actions
(`homePage.search(...)`, `checkout.payWith(...)`) and leave assertions to the
tests. Locators lean on the app's `data-test` attributes via a custom
`testIdAttribute`, which is far more stable than CSS/text selectors.

**Fixtures own setup.** Need a logged-in customer? Ask for the `signedIn`
fixture. Need a fresh account? Ask for `customer`. Under the hood those register
a brand-new user through the API and hand the test what it needs — no shared
mutable state, no reused demo account, so tests don't step on each other in
parallel.

**The API client doubles as a contract test.** `ToolshopApi` wraps Playwright's
request context; the API specs validate responses against Zod schemas, so a
breaking change in the payload shape fails a test instead of slipping through.

**Built for a shared demo.** The target app is public and stateful, so the suite
leans on Playwright's auto-waiting, synchronises on the requests behind
search/sort, and uses unique generated data to keep runs independent and
repeatable.

## CI

`.github/workflows/ci.yml` runs on every push and PR:

1. **quality** — ESLint, `tsc`, Prettier check.
2. **test** — a matrix of `api`, `ui-1`, `ui-2` (the UI project sharded in two),
   each uploading a blob report.
3. **report** — merges the blobs into a single HTML report and uploads it as an
   artifact.

## License

MIT
