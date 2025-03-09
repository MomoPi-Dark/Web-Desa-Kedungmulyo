import PWA from "next-pwa";

const withPWA = PWA({
  dest: "build",
  cleanupOutdatedCaches: true,
  cacheOnFrontEndNav: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/www\.google\.com\/maps\/embed\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-maps",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /^\/api\/.*$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    },
    {
      urlPattern: /\.(?:js|css|html)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest.json$/],
  mode: process.env.NODE_ENV,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWA({
  experimental: {
    typedRoutes: process.env.NODE_ENV === "development",
  },
  images: {
    remotePatterns: [
      { hostname: "api.uifaces.co", protocol: "https" },
      { hostname: "randomuser.me", protocol: "https" },
      { hostname: "imgur.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "cdn.discordapp.com", protocol: "https" },
      { hostname: "discord.com", protocol: "https" },
      { hostname: "discord.com/api/v10", protocol: "https" },
      { hostname: "media.discordapp.net", protocol: "https" },
      {
        hostname: "res.cloudinary.com",
        protocol: "http",
      },
    ],
  },
});

export default nextConfig;
