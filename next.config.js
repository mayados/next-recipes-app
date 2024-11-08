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
                hostname: 'images.clerk.com',
            },
            {
                protocol: 'https',
                hostname: 'www.gravatar.com',
            },
        ],
    }
}

module.exports = nextConfig