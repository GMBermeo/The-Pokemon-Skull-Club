/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.pokemontcg.io"],
  },
  staticPageGenerationTimeout: 2147483,
};

module.exports = nextConfig;
