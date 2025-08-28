import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/lib/**/*.ts',
        'src/modules/**/*.service.ts',
      ],
      exclude: [
        'src/index.ts',
        'src/config/**',
        'src/db/**',
        '**/*.d.ts',
      ],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
  },
});
