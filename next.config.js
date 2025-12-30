/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Comprehensive fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        'node:fs': false,
        'node:crypto': false,
        'node:stream': false,
        'node:path': false,
        'node:os': false,
        'node:url': false,
        module: false,
        child_process: false,
        worker_threads: false,
      };

      // Specific aliases to prevent Node.js module loading and fix crypto exports
      config.resolve.alias = {
        ...config.resolve.alias,
        // Force @noble/hashes to use browser-compatible versions
        '@noble/hashes/crypto': require.resolve('crypto-browserify'),
        '@noble/hashes/cryptoNode': false,
        '@noble/hashes/esm/cryptoNode': false,
        '@noble/hashes/esm/cryptoNode.js': false,
      };
    }
    
    // Handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'raw-loader',
    });

    // Add a rule to replace problematic imports
    config.module.rules.push({
      test: /cryptoNode\.js$/,
      use: 'null-loader',
    });

    // Comprehensive ignore plugin - be more aggressive
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource, context) {
          // Ignore @base-org/account entirely
          if (context && context.includes('@base-org/account')) {
            return true;
          }
          // Ignore any cryptoNode related files
          if (resource.includes('cryptoNode')) {
            return true;
          }
          // Ignore node: protocol imports
          if (resource.startsWith('node:')) {
            return true;
          }
          // Ignore specific Node.js modules
          if (['crypto', 'fs', 'path', 'os', 'child_process', 'worker_threads'].includes(resource)) {
            return true;
          }
          return false;
        },
      })
    );

    // Ignore the entire @base-org/account package
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /@base-org\/account/,
      })
    );

    // Define global variables to prevent undefined errors
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'global': 'globalThis',
      })
    );

    // Provide polyfills for global objects
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    );

    // Handle ESM modules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    return config;
  },
  serverExternalPackages: ['@envio-dev/hypersync-client'],
  transpilePackages: ['@noble/hashes', '@noble/curves', '@noble/secp256k1', 'webauthn-p256'],
  // Disable strict mode for better compatibility
  reactStrictMode: false,
};

module.exports = nextConfig;

module.exports = nextConfig;