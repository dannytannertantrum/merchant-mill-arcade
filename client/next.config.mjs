import config from './.config.mjs'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    env: {
        BASE_URL: 'http://localhost:7000',
        CUSTOM_SEARCH_API_KEY: config.custom_search_api_key,
        CUSTOM_SEARCH_ENGINE_ID: config.custom_search_engine_id
    },
    images: {
        disableStaticImages: true,
        domains: [
            'c.tenor.com',
            'media1.giphy.com',
            'classicplayfields.com',
            'arcademarquee.com',
            'thisoldgamearchive.com',
            'www.thisoldgamearchive.com',
            'i0.wp.com'
        ],
    },
    typescript: {
        ignoreBuildErrors: false
    }
}

export default nextConfig
