import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:5000/openapi.json',
  output: 'src/api',
  plugins: [
    {
      name: '@hey-api/typescript',
    },
    {
      name: '@hey-api/client-fetch',
      throwOnError: true,
    },
    {
      name: '@hey-api/sdk',
      responseStyle: 'data',
    },
  ],
});
