/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '/congressional-insight',  // Add base path for GitHub Pages
}

module.exports = nextConfig
