/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: true,
  devtoolSegmentExplorer: true,

  // Enable support for `global-not-found`, which allows you to more easily define a global 404 page.
  globalNotFound: true,
};

export default nextConfig;
