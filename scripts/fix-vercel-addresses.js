const { execSync } = require('child_process');

// Direcciones correctas de los contratos
const CORRECT_ADDRESSES = {
  NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS: "0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF",
  NEXT_PUBLIC_GUARD_NFT_ADDRESS: "0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52",
  NEXT_PUBLIC_GUARD_TOKEN_ADDRESS: "0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED",
};

const environments = ['production', 'preview', 'development'];

console.log('🔧 Actualizando direcciones de contratos en Vercel...\n');

// Verificar que Vercel CLI está instalado y el usuario está logueado
try {
  execSync('vercel whoami', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Error: No estás logueado en Vercel CLI');
  console.log('Por favor ejecuta: vercel login');
  process.exit(1);
}

// Función para actualizar una variable de entorno
function updateEnvVar(key, value, environment) {
  try {
    console.log(`  Actualizando ${key} en ${environment}...`);
    
    const isWindows = process.platform === 'win32';
    const tempFile = require('path').join(process.cwd(), `.temp_${key}_${Date.now()}.txt`);
    const fs = require('fs');
    
    if (isWindows) {
      fs.writeFileSync(tempFile, value, 'utf-8');
      const command = `powershell -Command "Get-Content '${tempFile}' | vercel env rm ${key} ${environment} --yes 2>&1 | Out-Null; Get-Content '${tempFile}' | vercel env add ${key} ${environment}"`;
      
      try {
        execSync(command, {
          stdio: 'inherit',
          shell: true,
          cwd: process.cwd()
        });
      } finally {
        if (fs.existsSync(tempFile)) {
          try {
            fs.unlinkSync(tempFile);
          } catch (e) {
            // Ignorar errores al eliminar archivo temporal
          }
        }
      }
    } else {
      // Primero eliminar la variable existente (si existe)
      try {
        execSync(`echo "y" | vercel env rm ${key} ${environment}`, { stdio: 'pipe' });
      } catch (e) {
        // Ignorar si no existe
      }
      
      // Agregar la nueva
      const command = `echo "${value}" | vercel env add ${key} ${environment}`;
      execSync(command, {
        stdio: 'inherit',
        shell: true
      });
    }
    
    console.log(`  ✅ ${key} actualizada en ${environment}\n`);
    return true;
  } catch (error) {
    const errorMsg = error.message || error.toString() || '';
    console.error(`  ❌ Error actualizando ${key} en ${environment}:`, errorMsg, '\n');
    return false;
  }
}

// Actualizar cada variable en cada entorno
for (const env of environments) {
  console.log(`\n📦 Actualizando variables en entorno ${env}...\n`);
  
  for (const [key, value] of Object.entries(CORRECT_ADDRESSES)) {
    updateEnvVar(key, value, env);
  }
}

console.log('\n✅ ¡Actualización completada!\n');
console.log('📝 Direcciones configuradas:');
console.log(`   AuditRegistry: ${CORRECT_ADDRESSES.NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS}`);
console.log(`   GuardNFT: ${CORRECT_ADDRESSES.NEXT_PUBLIC_GUARD_NFT_ADDRESS}`);
console.log(`   GuardToken: ${CORRECT_ADDRESSES.NEXT_PUBLIC_GUARD_TOKEN_ADDRESS}\n`);
console.log('🚀 Próximo paso: Redesplegar la aplicación con: pnpm deploy:full\n');
