import { coverageConfigDefaults, defineConfig } from 'vitest/config';
// Forma de fazer o Vitest entender o aliases do ts
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environmentMatchGlobs: [
            ["test/controllers/**", "prisma"]
        ],
        coverage: {
            exclude: [ 
                ...coverageConfigDefaults.exclude,
                "**/src/main/**",
                "**/src/server.ts",
            ]
        }
    }
})