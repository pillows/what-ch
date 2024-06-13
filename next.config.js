/* eslint-disable @typescript-eslint/no-var-requires */
// Import the plugin
const { PyodidePlugin } = require('@pyodide/webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Enable static exports for the App Router.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: "export",
  images: {
    unoptimized: true,
  },
  // distDir: "out",

  /**
   * Set base path. This is the slug of your GitHub repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "what-ch",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Add the PyodidePlugin to the plugins array
    if (!isServer) {
      config.plugins.push(new PyodidePlugin());
      // Replace node-fetch with an empty module on the client side, since it's not used there
      config.resolve.alias['node-fetch'] = false;
    }
    if (isServer) {
      // Do not include Pyodide in the server-side bundle
      config.externals = ['pyodide', ...(config.externals || [])];
    }
    // Return the modified config
    return config;
  }
};

module.exports = nextConfig;
