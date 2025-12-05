const fs = require('fs');
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

// Variables to exclude (Vercel-specific or not needed)
const excludeVars = [
  'NODE_ENV',
  'NX_DAEMON',
  'TURBO_CACHE',
  'TURBO_DOWNLOAD_LOCAL_ENABLED',
  'TURBO_REMOTE_ONLY',
  'TURBO_RUN_SUMMARY',
  'VERCEL',
  'VERCEL_ENV',
  'VERCEL_OIDC_TOKEN',
  'VERCEL_TARGET_ENV',
  'NEXT_PUBLIC_APP_URL', // Usually set by Vercel automatically
];

lines.forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return;
  }

  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    
    // Skip excluded variables
    if (excludeVars.includes(key)) {
      return;
    }
    
    // Remove quotes if present
    value = value.replace(/^["']|["']$/g, '');
    
    // Skip placeholder values and empty values
    if (key && value && !value.includes('your_') && value !== '' && value !== 'development' && value !== 'production') {
      envVars[key] = value;
    }
  }
});

console.log(`✅ Found ${Object.keys(envVars).length} environment variables\n`);

// Function to add env var to Vercel
function addEnvVar(key, value, environment) {
  try {
    console.log(`Adding ${key} to ${environment}...`);
    
    // Escape special characters in value for shell
    const escapedValue = value.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    
    // Use platform-specific command
    const isWindows = process.platform === 'win32';
    let command;
    
    if (isWindows) {
      // Windows PowerShell
      command = `powershell -Command "Write-Output '${escapedValue}' | vercel env add ${key} ${environment}"`;
    } else {
      // Unix/Linux/Mac
      command = `echo "${escapedValue}" | vercel env add ${key} ${environment}`;
    }
    
    execSync(command, {
      stdio: 'inherit',
      shell: true
    });
    console.log(`✅ ${key} added to ${environment}\n`);
  } catch (error) {
    console.error(`❌ Error adding ${key} to ${environment}:`, error.message);
    // Continue with next variable even if one fails
  }
}

// Get environment from command line argument or default to production
const environment = process.argv[2] || 'production';

console.log(`🚀 Adding variables to Vercel ${environment} environment...\n`);

// Add each variable
let count = 0;
for (const [key, value] of Object.entries(envVars)) {
  addEnvVar(key, value, environment);
  count++;
}

console.log(`\n✅ Completed! Added ${count} environment variables to ${environment}`);
console.log('\n📝 Next steps:');
console.log('   1. Review variables in Vercel dashboard');
console.log('   2. Deploy with: vercel --prod');

