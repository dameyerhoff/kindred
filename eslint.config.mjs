import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// This is the "Code Quality Guard" that checks your work for mistakes
const eslintConfig = defineConfig([
  // This part adds the standard rules that Next.js uses to keep the site healthy
  ...nextVitals,

  // This part tells the guard which files it should never bother checking
  globalIgnores([
    // These are the folders where the computer builds the final website
    ".next/**",
    "out/**",
    "build/**",
    // This is a technical helper file that doesn't need to be checked
    "next-env.d.ts",
  ]),
]);

// This sends the configuration out so the project can use it
export default eslintConfig;
