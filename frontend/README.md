# PDF Converter - Frontend

This directory contains the frontend for the PDF Converter application, built with React, TypeScript, and Vite. It provides the user interface for uploading PDF files and selecting conversion formats.

## Key Technologies

- **React:** For building the user interface.
- **TypeScript:** For static typing.
- **Vite:** As the development server and build tool.
- **Tailwind CSS:** For utility-first styling.
- **Axios:** For making API requests to the backend.
- **React Dropzone:** For file upload functionality.
- **Shadcn UI (implicitly via `components/ui`):** For UI components.

## Installation

To set up the frontend development environment, ensure you have Node.js and pnpm installed.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install
```

## Running the Development Server

```bash
pnpm run dev
```

This will start the Vite development server, typically available at `http://localhost:5173`.
The frontend application expects the backend server to be running on `http://localhost:5000` to handle API requests for PDF conversion.

## Building for Production

```bash
pnpm run build
```
This command bundles the application for production into the `dist` directory.

## Linting

To lint the codebase:
```bash
pnpm run lint
```

---

*The following is the original Vite template information regarding advanced ESLint configuration, preserved for reference if deeper customization is needed.*

### Expanding the ESLint configuration (Vite Default)

If you are developing a production application, Vite recommends updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
// eslint.config.js
import tseslint from 'typescript-eslint';

export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname, // Make sure this is correct for your setup
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install `eslint-plugin-react` and update the config:

```js
// eslint.config.js
import tseslint from 'typescript-eslint'; // Assuming tseslint is already imported
import react from 'eslint-plugin-react'; // Requires: npm install -D eslint-plugin-react

export default tseslint.config(
  // ... other configurations
  {
    files: ['src/**/*.{ts,tsx}'], // Target React files
    // settings: { react: { version: 'detect' } }, // Or specify version e.g. '18.3'
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules, // If using React 17+ new JSX transform
      // ... any other react specific rule overrides
    },
  }
);
```
Note: The ESLint configuration (`eslint.config.js`) in this project might already be set up. The above is for guidance if further customization based on Vite's template recommendations is desired.
