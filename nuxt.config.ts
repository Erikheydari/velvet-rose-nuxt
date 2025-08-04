import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css', '~/assets/css/typography.css', '~/assets/fonts/fonts.css'],
  modules: ['@nuxt/eslint', '@nuxt/scripts', 'shadcn-nuxt', '@pinia/nuxt'],
  shadcn: {
    prefix: 'The',
    componentDir: '~/components/ui',
  },
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://78.157.42.110',
      apiPrefix: process.env.API_PREFIX || '/api'
    },
  },
})