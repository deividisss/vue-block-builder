/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHROMATIC_PROJECT_TOKEN: string;
  readonly VITE_SOME_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
