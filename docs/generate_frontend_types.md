[Back to readme](../README.md)

# Generate frontend API types

The frontend API client/types are generated from the backend OpenAPI schema.

Run this from the repo root:
```
python3 -m scripts.generate_frontend_types
```

The script starts the backend, waits for `/openapi.json`, generates the client into `frontend/src/api`, and shuts the backend down.
