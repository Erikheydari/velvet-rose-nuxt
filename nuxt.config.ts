import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/tailwind.css', '~/assets/css/typography.css', '~/assets/fonts/fonts.css', '~/assets/css/transitions.css', '~/assets/css/animations.css'],
  modules: ['@nuxt/eslint', '@nuxt/scripts', 'shadcn-nuxt', '@pinia/nuxt', 'nuxt-svgo'],
  shadcn: {
    prefix: 'The',
    componentDir: '~/components/ui',
  },

  app: {
    baseURL: '/',
/*     pageTransition: {
      name: 'page',
      mode: 'out-in',
      duration: 900,
    }, */
    head: {
      title: 'Velvet Rose',
      titleTemplate: '%s - Velvet Rose',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ]
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://78.157.42.110',
      mediaUrl: process.env.MEDIA_URL || 'http://78.157.42.110/storage/',
      apiPrefix: process.env.API_PREFIX || '/api',
    },
  },
});