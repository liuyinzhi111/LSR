import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals, ...nextTs,
  { rules: {
    // These local, pre-encoded assets are also served by a static export.
    '@next/next/no-img-element': 'off',
    'react-hooks/set-state-in-effect': 'off',
  } },
  // Preserve the original fonts in this single-page static export.
  { files: ['app/layout.tsx'], rules: { '@next/next/no-page-custom-font': 'off' } },
  globalIgnores(['.next/**', 'out/**', 'public/XM/**', 'next-env.d.ts']),
]);
