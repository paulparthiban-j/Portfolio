const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
let port = 3006; // default

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const portMatch = envContent.match(/^PORT=(\d+)/m);
  if (portMatch) {
    port = portMatch[1];
  }
}

// Run next dev with the port
const command = `next dev -p ${port}`;
console.log(`Starting Next.js on port ${port}...`);
execSync(command, { stdio: 'inherit' });

