import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    webpackConfig.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
