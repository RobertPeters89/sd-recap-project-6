import js from "@eslint/js";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";

export default tseslint.config(
  { ignores: ["dist", "coverage", ".github"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  sonarjs.configs.recommended
);
