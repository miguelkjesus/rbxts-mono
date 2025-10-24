import { defineConfig } from 'eslint/config'
import roblox from 'eslint-plugin-roblox-ts'

export default defineConfig({
  files: ['src/**/*'],
  ...roblox.configs.recommended,
})
