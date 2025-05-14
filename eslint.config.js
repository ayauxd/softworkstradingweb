export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["dist/**", "node_modules/**", ".eslintrc.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },
    rules: {
      // General ESLint rules
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      
      // React specific rules
      "react/react-in-jsx-scope": "off", // Not needed with modern JSX transform
      "react/prop-types": "off", // We use TypeScript for prop validation
    },
  },
  // Node/server specific rules
  {
    files: ["server/**/*.{js,ts}"],
    rules: {
      "no-console": "off", // Allow console in server code
    },
  },
  // Test specific rules
  {
    files: ["**/*.test.{js,ts,jsx,tsx}"],
    rules: {
      "no-console": "off",
    },
  },
];