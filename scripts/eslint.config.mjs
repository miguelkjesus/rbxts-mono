import { defineConfig } from 'eslint/config'

import js from '@eslint/js'
import ts from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'

export default defineConfig(
  js.configs.recommended,
  ts.configs.recommended,

  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-namespace': 'off',
    },
  },

  prettier
)
