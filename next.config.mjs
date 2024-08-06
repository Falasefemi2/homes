/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "a0.muscache.com",
                protocol: "https",
                port: "",
            },
            { hostname: "utfs.io" },
        ],
    },
};

export default nextConfig;