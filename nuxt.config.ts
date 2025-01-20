// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: ["@nuxt/ui", "nuxt-lodash"],
    lodash: {
        prefix: "use",
        prefixSkip: ["is"],
    },
    plugins: [
        '~/plugins/vue-the-mask.js'
    ],
})