/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    basePath: '/arcade',
    env: {
        BASE_URL: 'http://localhost:7000',
        CUSTOM_SEARCH_API_KEY: 'AIzaSyALU8i7lMGxQQJSmGdoI4i9-eBZD5KvA3g',
        CUSTOM_SEARCH_ENGINE_ID: '8f37cbcb9fb441e31'
    },
    images: {
        disableStaticImages: true,
    },
    typescript: {
        ignoreBuildErrors: false
    }
}

export default nextConfig
