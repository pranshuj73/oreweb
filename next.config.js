const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: { disableDevLogs: true, },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export'
}

module.exports = withPWA(nextConfig)
