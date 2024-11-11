// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/src/assets/scss/main.scss'],
  ssr: true,
  modules: ['@nuxt/eslint'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "~/src/assets/scss/_colors.scss" as *;'
        }
      }
    }
  },
  alias: {
    '@composables': '/<rootDir>/src/composables/',
    '@components': '/<rootDir>/src/components/',
    '@assets': '/<rootDir>/src/assets/'
  }
})