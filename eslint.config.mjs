import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
    {
    ignores: ["lib/generated/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: ["lib/generated/**"],  

    rules: {
      "@typescript-eslint/no-unused-vars": "off", 
      "@typescript-eslint/no-require-imports": "off", 
    },
  },
];

export default eslintConfig;
