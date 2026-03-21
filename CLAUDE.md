# CLAUDE.md

## Tests

Run backend tests from the .venv:

```sh
python3.13 -m venv .venv
source .venv/bin/activate
export DYLD_LIBRARY_PATH=/opt/homebrew/lib && python3 -m pytest backend/tests
```

Make sure to run the tests after doing larger changes. Do not ask to run the tests, just do it.

When creating new user flows, add a functional test in `frontend/tests/e2e/functional.spec.js`.

When creating new frontend pages, add screenshot entries for both desktop and mobile in `frontend/tests/e2e/screenshots.spec.js`. Update the seed script (`scripts/seed_e2e_screenshots.py`) if the new page needs specific data.

To run functional tests, do: `cd frontend && npm run test:e2e`
To run screenshot tests, do: `cd frontend && npm run test:e2e:screenshots`
To update screenshot baselines, do: `cd frontend && npm run test:e2e:update-snapshots`

## Frontend Types

When changes affect both the backend and frontend API surface, run the type generation script:

```sh
python3 -m scripts.generate_frontend_types
```

## Backwards compatibility

There is never a need to make the api (or any other code) backwards compatible. The frontend and backend ships together.
