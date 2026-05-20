import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  // 1. Configuración base de JavaScript
  js.configs.recommended,
  
  // 2. Configuración oficial de TypeScript
  ...tseslint.configs.recommended,
  
  // 3. Opciones globales y de entorno para tus archivos
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  
  // 4. Desactivar reglas de ESLint que choquen con Prettier (Siempre al final)
  eslintConfigPrettier
);
