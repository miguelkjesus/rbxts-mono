import { defineConfig, globalIgnores } from 'eslint/config'

import js from '@eslint/js'
import ts from 'typescript-eslint'
import roblox from 'eslint-plugin-roblox-ts'
import prettier from 'eslint-plugin-prettier/recommended'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig(
  globalIgnores([
    'out/**/*',
    'src/generated/**/*',
    'eslint.config.mjs'
  ]),

  js.configs.recommended,
  ts.configs.recommendedTypeChecked,
  ts.configs.stylisticTypeChecked,
  roblox.configs.recommended,

  {
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: 'class' },
        { blankLine: 'always', prev: 'block-like', next: 'class' }
      ]
    }
  },

  prettier
)
