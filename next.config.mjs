/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '*.run.app',
    'ais-dev-rkbh6wjk2h76f4i7jpgsk4-327770134583.europe-west1.run.app',
    'ais-pre-rkbh6wjk2h76f4i7jpgsk4-327770134583.europe-west1.run.app',
  ],
};

export default nextConfig;
