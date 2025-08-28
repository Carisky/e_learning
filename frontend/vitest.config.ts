import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/features/**/model/**/*.ts',
        'src/shared/api/**/*.ts',
        'src/features/auth/ui/LoginForm.tsx',
        'src/features/users/ui/UsersList.tsx',
      ],
      exclude: [
        '**/*.d.ts',
      ],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
  },
});
