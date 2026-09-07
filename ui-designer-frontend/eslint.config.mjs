import { fileURLToPath } from 'node:url'
import tailwind from 'eslint-plugin-tailwindcss'
import withNuxt from './.nuxt/eslint.config.mjs'

// Plugin hledá vstupní CSS relativně k lintovanému souboru, ne ke konfiguraci —
// s relativní cestou to skončí na ENOENT. Proto absolutní.
const cssConfigPath = fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))

export default withNuxt(
  tailwind.configs.recommended,
  {
    settings: {
      tailwindcss: { cssConfigPath, functions: ['cn', 'tv'] },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      // Kanonické pořadí rozhází `vos-*` doprostřed řetězce. Na kaskádu to nemá
      // vliv (o té rozhoduje pořadí ve stylopisu), ale ztratí se, čím ten prvek
      // je — a to je u téhle knihovny první, co má být vidět.
      'tailwindcss/classnames-order': 'off',
    },
  },
)
