const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },
            {
                protocol: 'https',
                hostname: 'www.gravatar.com',
            },
            {
                protocol: 'https',
                hostname: 'images.clerk.dev',
            },
        ],
    }
}

module.exports = nextConfig