import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
