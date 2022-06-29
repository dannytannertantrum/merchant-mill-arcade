/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: false
    },
    images: {
        disableStaticImages: true,
    },
    basePath: '/arcade'
}

export default nextConfig
