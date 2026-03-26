

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // включает режим "статического сайта"
  images: {
    unoptimized: true, // если используешь <Image />, иначе могут быть ошибки при экспорте
  },
};

export default nextConfig;
