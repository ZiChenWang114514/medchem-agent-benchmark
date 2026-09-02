import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isGitHubPages ? '/medchem-agent-benchmark' : '',
  assetPrefix: isGitHubPages ? '/medchem-agent-benchmark/' : '',
};

export default nextConfig;
