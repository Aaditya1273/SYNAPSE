/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Warning: This allows production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
    images: {
        domains: ["lh3.googleusercontent.com"],
    },
    // Exclude template folders from build
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    transpilePackages: ["@worldcoin/idkit"],
    webpack: (config, { isServer }) => {
        // Suppress optional peer dependency warnings from wagmi connectors
        // These connector packages (@metamask/sdk, porto, @walletconnect/ethereum-provider, etc.)
        // are optional - wagmi/rainbowkit still work without them for basic usage.
        config.resolve = config.resolve || {};
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "@metamask/sdk": false,
            "porto": false,
            "porto/internal": false,
            "@safe-global/safe-apps-sdk": false,
            "@safe-global/safe-apps-provider": false,
            "@walletconnect/ethereum-provider": false,
            "@base-org/account": false,
            "@coinbase/wallet-sdk": false,
        };

        // Exclude template folders from compilation
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];
        config.module.rules.push({
            test: /\.tsx?$/,
            exclude: [
                /cre-templates-main/,
                /PrivaCRE\/my-workflow/,
            ],
        });

        return config;
    },
};

export default nextConfig;
