// FIX: This file was empty, causing module resolution errors.
// It now re-exports all types from the `types/index.ts` barrel file,
// making all type definitions available under the './types' import path.
export * from "./types/index";
