import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';

const external = ['react', 'next/headers'];

export default [
  // Main build (includes everything)
  {
    input: 'src/index.ts',
    external,
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
    ],
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  // Server-only build (excludes React components)
  {
    input: 'src/server.ts',
    external,
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
    ],
    output: [
      {
        file: 'dist/server.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/server.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  // React-only build
  {
    input: 'src/react.ts',
    external: [...external, '@jurono/sdk/server'],
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
    ],
    output: [
      {
        file: 'dist/react.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/react.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  // Type definitions - Main
  {
    input: 'src/index.ts',
    external,
    plugins: [dts()],
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
  },
  // Type definitions - Server
  {
    input: 'src/server.ts',
    external,
    plugins: [dts()],
    output: {
      file: 'dist/server.d.ts',
      format: 'es',
    },
  },
  // Type definitions - React
  {
    input: 'src/react.ts',
    external,
    plugins: [dts()],
    output: {
      file: 'dist/react.d.ts',
      format: 'es',
    },
  },
  // Next.js build (includes server actions)
  {
    input: 'src/nextjs.ts',
    external,
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
    ],
    output: [
      {
        file: 'dist/nextjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/nextjs.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  // Type definitions - Next.js
  {
    input: 'src/nextjs.ts',
    external,
    plugins: [dts()],
    output: {
      file: 'dist/nextjs.d.ts',
      format: 'es',
    },
  },
];