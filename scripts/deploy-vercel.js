const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configuración del autor
const AUTHOR_NAME = 'Eras256';
const AUTHOR_EMAIL = 'ticketsafe4@gmail.com';

// Leer .env.local o .env
const envFile = fs.existsSync('.env.local') ? '.env.local' : '.env';

if (!fs.existsSync(envFile)) {
  console.error(`❌ Error: ${envFile} not found`);
  console.log('Por favor crea .env.local con tus variables de entorno');
  process.exit(1);
}

console.log(`📖 Leyendo variables de entorno desde ${envFile}...\n`);

const envContent = fs.readFileSync(envFile, 'utf-8');
const lines = envContent.split('\n');

const envVars = {};

// Variables a excluir (específicas de Vercel o no necesarias)
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
    
    // Saltar variables excluidas
    if (excludeVars.includes(key)) {
      return;
    }
    
    // Remover comillas si están presentes
    value = value.replace(/^["']|["']$/g, '');
    
    // Saltar valores placeholder y valores vacíos
    if (key && value && !value.includes('your_') && value !== '' && value !== 'development' && value !== 'production') {
      envVars[key] = value;
    }
  }
});

console.log(`✅ Encontradas ${Object.keys(envVars).length} variables de entorno\n`);

// Función para agregar variable de entorno a Vercel
function addEnvVar(key, value, environment) {
  try {
    console.log(`  Agregando ${key} a ${environment}...`);
    
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Windows - usar archivo temporal para pasar el valor
      const tempFile = path.join(process.cwd(), `.temp_${key}_${Date.now()}.txt`);
      
      try {
        // Escribir valor al archivo temporal
        fs.writeFileSync(tempFile, value, 'utf-8');
        
        // Usar Get-Content para leer y pasar a vercel env add
        const command = `powershell -Command "Get-Content '${tempFile}' | vercel env add ${key} ${environment}"`;
        
    const result = execSync(command, {
      stdio: 'pipe',
      shell: true,
      cwd: process.cwd(),
      encoding: 'utf-8'
    });
    
    // Mostrar salida si hay
    if (result) {
      console.log(result);
    }
      } finally {
        // Limpiar archivo temporal
        if (fs.existsSync(tempFile)) {
          try {
            fs.unlinkSync(tempFile);
          } catch (e) {
            // Ignorar errores al eliminar archivo temporal
          }
        }
      }
    } else {
      // Unix/Linux/Mac - usar echo con pipe
      const escapedValue = value.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');
      const command = `echo "${escapedValue}" | vercel env add ${key} ${environment}`;
      
      execSync(command, {
        stdio: 'inherit',
        shell: true
      });
    }
    
    console.log(`  ✅ ${key} agregada a ${environment}\n`);
    return true;
  } catch (error) {
    // Si la variable ya existe, continuar
    const errorMsg = error.message || error.toString() || '';
    const errorOutput = (error.stdout?.toString() || error.stderr?.toString() || '').toLowerCase();
    const fullError = (errorMsg + ' ' + errorOutput).toLowerCase();
    
    if (fullError.includes('already exists') || 
        fullError.includes('already configured') ||
        fullError.includes('already been added') ||
        fullError.includes('has already been added')) {
      console.log(`  ⚠️  ${key} ya existe en ${environment}, omitiendo...\n`);
      return true;
    }
    // Mostrar error completo solo si no es un error de "ya existe"
    if (errorOutput) {
      console.error(`  ❌ Error agregando ${key} a ${environment}`);
      console.error(`     ${errorOutput.trim()}\n`);
    } else {
      console.error(`  ❌ Error agregando ${key} a ${environment}:`, errorMsg, '\n');
    }
    return false;
  }
}

// Función para configurar git con el autor
function setupGitAuthor() {
  try {
    console.log('🔧 Configurando autor de Git...\n');
    execSync(`git config user.name "${AUTHOR_NAME}"`, { stdio: 'inherit' });
    execSync(`git config user.email "${AUTHOR_EMAIL}"`, { stdio: 'inherit' });
    console.log(`✅ Autor configurado: ${AUTHOR_NAME} <${AUTHOR_EMAIL}>\n`);
  } catch (error) {
    console.warn(`⚠️  No se pudo configurar el autor de Git: ${error.message}\n`);
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando despliegue a Vercel...\n');
  
  // Configurar autor de Git
  setupGitAuthor();
  
  // Verificar que Vercel CLI está instalado y el usuario está logueado
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Error: No estás logueado en Vercel CLI');
    console.log('Por favor ejecuta: vercel login');
    process.exit(1);
  }
  
  // Agregar variables a los tres entornos
  const environments = ['production', 'preview', 'development'];
  
  for (const env of environments) {
    console.log(`\n📦 Agregando variables a entorno ${env}...\n`);
    let successCount = 0;
    
    for (const [key, value] of Object.entries(envVars)) {
      if (addEnvVar(key, value, env)) {
        successCount++;
      }
    }
    
    console.log(`✅ ${successCount}/${Object.keys(envVars).length} variables agregadas a ${env}\n`);
  }
  
  // Desplegar a producción
  console.log('\n🚀 Desplegando a producción...\n');
  try {
    execSync('vercel --prod --yes', {
      stdio: 'inherit',
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: AUTHOR_NAME,
        GIT_AUTHOR_EMAIL: AUTHOR_EMAIL,
        GIT_COMMITTER_NAME: AUTHOR_NAME,
        GIT_COMMITTER_EMAIL: AUTHOR_EMAIL
      }
    });
    console.log('\n✅ ¡Despliegue completado exitosamente!\n');
  } catch (error) {
    console.error('\n❌ Error durante el despliegue:', error.message);
    process.exit(1);
  }
}

// Ejecutar
main().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

