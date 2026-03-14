const path = require('path');
const fs = require('fs');

// Load ALL environment variables from root .env file if it exists
const rootEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(rootEnvPath)) {
  const envFile = fs.readFileSync(rootEnvPath, 'utf8');
  envFile.split('\n').forEach(line => {
    // Skip comments and empty lines
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return;
    
    const match = trimmedLine.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      value = value.replace(/^["']|["']$/g, '');
      
      // Set all environment variables (not just NEXT_PUBLIC_)
      // This ensures server-side code can access all vars from root .env
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
  console.log('✅ Loaded environment variables from root .env file');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Only proxy to external backend when explicitly set (e.g. local dev with separate backend)
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return [];
    return [
      { source: '/api/:path*', destination: `${apiUrl}/api/:path*` },
    ];
  },
  // Prevent server-side rendering errors from crashing the page
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
