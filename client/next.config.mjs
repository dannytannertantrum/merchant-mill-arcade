/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: false
    },
    images: {
        disableStaticImages: true,
    }
}

export default nextConfig
