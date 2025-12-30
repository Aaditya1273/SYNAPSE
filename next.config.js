/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        'node:fs': false,
        'node:crypto': false,
        'node:stream': false,
        'node:path': false,
        'node:os': false,
        'node:url': false,
      };
    }
    
    // Handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'raw-loader',
    });

    // Ignore node: protocol imports in browser
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^node:/,
      })
    );

    return config;
  },
  serverExternalPackages: ['@envio-dev/hypersync-client']
};

module.exports = nextConfig;