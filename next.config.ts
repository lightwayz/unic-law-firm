/** @type {import("next").NextConfig} */
let nextConfig: {
    productionBrowserSourceMaps: boolean;
    eslint: { ignoreDuringBuilds: boolean };
    typescript: { ignoreBuildErrors: boolean };
    experimental: { serverSourceMaps: boolean }
};
// eslint-disable-next-line prefer-const
nextConfig = {
    productionBrowserSourceMaps: false,

    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

    experimental: {
        serverSourceMaps: false,
    },
};

export default nextConfig;
