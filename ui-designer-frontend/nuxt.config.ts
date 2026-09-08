import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxtjs/color-mode', '@nuxt/fonts'],

  /*
   * Písmo si stáhne modul při buildu a hostuje ho lokálně — za běhu tedy
   * neodchází požadavek na Google. Používá ho jen design Pastel; visionOS
   * si drží systémový stack, protože na Macu vytáhne opravdové SF Pro,
   * které se hostovat nesmí.
   *
   * Plus Jakarta Sans je pod SIL OFL, takže se hostovat smí.
   */
  fonts: {
    families: [{ name: 'Plus Jakarta Sans', provider: 'google', weights: [400, 500, 600, 700] }],
  },

  css: ['~/assets/css/main.css'],

  // Bez pathPrefix se komponenta jmenuje podle souboru, ne podle složky.
  // `extensions: ['vue']` je nutné — jinak by skener zaregistroval i `.ts`
  // soubory vedle komponent (button.variants.ts → <ButtonVariants>).
  components: [{ path: '~/components', pathPrefix: false, extensions: ['vue'] }],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'ui-designer-mode',
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
