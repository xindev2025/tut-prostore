import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  {
    // Ignore all Prisma and node_modules files
    ignores: [
      'node_modules/**',
      '.next/**',
      '.prisma/**', // just in case
      'lib/generated/**',
      'node_modules/.prisma/**'
    ]
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript')
]

export default eslintConfig
