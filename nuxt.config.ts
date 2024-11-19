// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  buildDir: 'build',
  css: ['~/src/assets/scss/main.scss'],
  ssr: false,
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
  devServer: {
    
  },
  alias: {
    '@composables':  '/src/composables/',
    '@interfaces':  '/src/interfaces/',
    '@utility': '/src/utility/'
  },
})