import adonisPrettierConfig from '@adonisjs/prettier-config'

adonisPrettierConfig.plugins.push('prettier-plugin-tailwindcss')

/** @type {import("prettier").Config} */
const config = {
  ...adonisPrettierConfig,
  bracketSameLine: true,
  htmlWhitespaceSensitivity: 'ignore',
}
export default config
