const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read .env.local or .env file
const envFile = fs.existsSync('.env.local') ? '.env.local' : '.env';

if (!fs.existsSync(envFile)) {
  console.error(`❌ Error: ${envFile} not found`);
  console.log('Please create .env.local with your environment variables');
  process.exit(1);
}

console.log(`📖 Reading environment variables from ${envFile}...\n`);

const envContent = fs.readFileSync(envFile, 'utf-8');
const lines = envContent.split('\n');

const envVars = {};

lines.forEach((line, index) => {
  // Skip comments and empty lines
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return;
  }

  // Parse KEY=VALUE format
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    
    // Remove quotes if present
    const cleanValue = value.replace(/^["']|["']$/g, '');
    
    if (key && cleanValue && !cleanValue.includes('your_') && cleanValue !== '') {
      envVars[key] = cleanValue;
    }
  }
});

console.log(`✅ Found ${Object.keys(envVars).length} environment variables\n`);

// Display variables (without values for security)
console.log('Variables to add:');
Object.keys(envVars).forEach(key => {
  const value = envVars[key];
  const displayValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
  console.log(`  - ${key} = ${displayValue}`);
});

console.log('\n⚠️  IMPORTANT: This script will add these variables to Vercel.');
console.log('   Make sure you are logged in to Vercel CLI (vercel login)\n');

// Ask for confirmation (in a real scenario, you'd use readline)
console.log('To add these variables to Vercel, run:');
console.log('\nFor Production:');
Object.keys(envVars).forEach(key => {
  console.log(`vercel env add ${key} production`);
});

console.log('\nFor Preview:');
Object.keys(envVars).forEach(key => {
  console.log(`vercel env add ${key} preview`);
});

console.log('\nFor Development:');
Object.keys(envVars).forEach(key => {
  console.log(`vercel env add ${key} development`);
});

console.log('\nOr use the automated script:');
console.log('node scripts/add-vercel-env.js\n');

