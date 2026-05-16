/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' https: blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.jikan.moe https://accounts.google.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.myanimelist.net" },
      { protocol: "https", hostname: "img1.ak.crunchyroll.com" },
      { protocol: "https", hostname: "www.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;