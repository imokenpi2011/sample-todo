import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/sample-todo' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/sample-todo/' : '',
}

export default nextConfig
