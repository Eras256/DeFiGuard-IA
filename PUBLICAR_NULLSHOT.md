# 📤 Guía Completa: Cómo Publicar DeFiGuard AI en Nullshot Platform

## 🎯 Objetivo
Publicar tu aplicación web **DeFiGuard AI** en Nullshot Platform para cumplir con los requisitos del **Track 1b** del NullShot Hacks Season 0.

---

## ✅ Paso 1: Iniciar Sesión en Nullshot

1. **Ve a**: [https://nullshot.ai/jam](https://nullshot.ai/jam)

2. **Haz clic en "Sign In"** (arriba a la derecha)

3. **Elige un método de autenticación**:
   - ✅ Google
   - ✅ Apple
   - ✅ Binance
   - ✅ Wallet (Web3)
   - ✅ Email

4. **Completa el proceso de inicio de sesión**

---

## ✅ Paso 2: Abrir tu Proyecto "DeFi Guard IA"

1. **Después de iniciar sesión**, busca tu proyecto en la lista:
   - Busca **"DeFi Guard IA"** en la sección "🔥 Last 24 Hour" o "📈 New & Trending"
   - O usa el buscador: "Find with Name and Author"

2. **Haz clic en "DeFi Guard IA"** para abrir el Jam

3. **Verifica que estés dentro del proyecto**:
   - Deberías ver la URL: `https://nullshot.ai/jam/[ID-del-proyecto]`
   - Deberías ver el preview de tu aplicación a la derecha

---

## ✅ Paso 3: Configurar el Proyecto (si es necesario)

Antes de publicar, asegúrate de que tu proyecto esté configurado correctamente:

### 3.1. Verificar Build Configuration

1. **Busca el botón "Additional Options"** (tres puntos `...` arriba a la izquierda)
2. **Haz clic y busca "Settings" o "Configuration"**
3. **Verifica/Configura**:
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`
   - **Node Version**: `18` o `20`

### 3.2. Configurar Variables de Entorno

1. **En Settings**, busca la sección **"Environment Variables"**
2. **Agrega todas las variables necesarias**:
   ```
   GEMINI_API_KEY=tu_api_key_aqui
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=tu_client_id_aqui
   THIRDWEB_SECRET_KEY=tu_secret_key_aqui
   NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
   NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
   NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://rpc.sepolia.org
   ```

### 3.3. Conectar con GitHub (si aplica)

1. **En Settings**, busca **"GitHub Integration"** o **"Import from GitHub"**
2. **Conecta tu repositorio**:
   - Autoriza acceso a GitHub
   - Selecciona tu repositorio: `DeFiGuardIA`
   - Sincroniza el código

---

## ✅ Paso 4: Publicar como Producto

### 4.1. Localizar el Botón "Publish Product"

1. **En la interfaz del Jam**, busca el botón **"Publish Product"** (arriba a la derecha del preview)
   - Está junto a los botones: "Full Screen Preview", "Share", "Check Code"
   - Icono: ⭐ o 📤

2. **Si no lo ves**:
   - Asegúrate de estar **autenticado**
   - Verifica que el proyecto esté **guardado**
   - Intenta hacer un **build** primero

### 4.2. Completar el Formulario de Publicación

Al hacer clic en **"Publish Product"**, deberías ver un formulario con:

#### Campos Requeridos:

1. **Título del Producto**:
   ```
   DeFiGuard AI - AI-Powered Smart Contract Security Auditor
   ```

2. **Descripción**:
   ```
   DeFiGuard AI es un auditor de seguridad de contratos inteligentes 
   impulsado por IA que utiliza Gemini 2.5 Flash y arquitectura MCP 
   para identificar vulnerabilidades en contratos Solidity en segundos.
   
   Características principales:
   - Análisis impulsado por IA con Gemini 2.5 Flash
   - Soporte multi-chain (Ethereum, Base, Arbitrum)
   - Correcciones automatizadas generadas por IA
   - Sistema de puntuación de riesgo completo
   - Certificación NFT on-chain
   - Monitoreo en tiempo real
   - Arquitectura MCP con Nullshot Framework
   
   Construido para NullShot Hacks Season 0 - Track 1b
   ```

3. **Tags** (OBLIGATORIO para el hackathon):
   ```
   Nullshot Hacks S0
   ```
   - ⚠️ **IMPORTANTE**: Debes agregar este tag exactamente así para que tu proyecto sea considerado para el hackathon

4. **Categoría/Tipo**:
   - Selecciona: **"Web App"** o **"Web Application"**

5. **Screenshots**:
   - Agrega 3-5 capturas de pantalla de tu aplicación
   - Muestra las características principales:
     - Landing page
     - Página de auditoría
     - Dashboard
     - Reportes de seguridad

6. **Enlaces**:
   - **GitHub**: `https://github.com/tu-usuario/DeFiGuardIA`
   - **Demo**: URL de tu aplicación desplegada (si tienes)
   - **Documentación**: Link a tu README o docs

7. **Video Demo** (Opcional pero recomendado):
   - Sube un video de 3-5 minutos mostrando:
     - Cómo funciona la aplicación
     - Características principales
     - Ejemplo de auditoría de contrato

### 4.3. Revisar y Publicar

1. **Revisa toda la información** antes de publicar
2. **Asegúrate de que el tag "Nullshot Hacks S0" esté presente**
3. **Haz clic en "Publish"** o **"Submit Product"**
4. **Espera la confirmación** de publicación

---

## ✅ Paso 5: Verificar la Publicación

1. **Después de publicar**, deberías recibir:
   - Un mensaje de confirmación
   - Una URL única de tu producto: `https://nullshot.ai/products/[tu-producto]`

2. **Visita la URL de tu producto** para verificar que se publicó correctamente

3. **Comparte el enlace** en tu submission del hackathon

---

## ✅ Paso 6: Enviar al Hackathon (DoraHacks)

1. **Ve a**: [https://dorahacks.io/hackathon/nullshothacks](https://dorahacks.io/hackathon/nullshothacks)

2. **Haz clic en "Submit Project"** o **"Submit Your Project"**

3. **Completa el formulario de submission**:
   - **Título**: DeFiGuard AI - AI-Powered Smart Contract Security Auditor
   - **Track**: Selecciona **Track 1b** (Submit and publish a web app using Nullshot)
   - **Nullshot Product URL**: Pega la URL de tu producto publicado
   - **GitHub Repository**: Link a tu repositorio
   - **Demo Video**: Link a tu video demo (3-5 minutos)
   - **Project Write-Up**: Descripción completa del proyecto
   - **Screenshots**: Agrega capturas de pantalla

4. **Asegúrate de incluir**:
   - ✅ Tag "Nullshot Hacks S0" en tu producto Nullshot
   - ✅ Link al producto publicado en Nullshot Platform
   - ✅ README completo con instrucciones
   - ✅ Video demo
   - ✅ Código fuente en GitHub

5. **Haz clic en "Submit"**

---

## 🔧 Solución de Problemas

### Problema: No veo el botón "Publish Product"

**Soluciones**:
1. ✅ Asegúrate de estar **autenticado** (iniciado sesión)
2. ✅ Verifica que estés dentro de un **Jam activo**
3. ✅ Intenta hacer un **build** del proyecto primero
4. ✅ Refresca la página (F5)

### Problema: El formulario no se abre

**Soluciones**:
1. ✅ Verifica tu conexión a internet
2. ✅ Limpia la caché del navegador
3. ✅ Intenta en otro navegador (Chrome, Firefox, Edge)
4. ✅ Desactiva extensiones del navegador temporalmente

### Problema: No puedo agregar el tag "Nullshot Hacks S0"

**Soluciones**:
1. ✅ Escribe el tag exactamente: `Nullshot Hacks S0`
2. ✅ Verifica que el campo de tags esté habilitado
3. ✅ Si no aparece, intenta escribir: `nullshot-hacks-s0` o `NullshotHacksS0`
4. ✅ Contacta al soporte: support@edenlayer.com

### Problema: El build falla

**Soluciones**:
1. ✅ Verifica que todas las variables de entorno estén configuradas
2. ✅ Revisa los logs del build para ver errores específicos
3. ✅ Asegúrate de que `package.json` tenga todos los scripts necesarios
4. ✅ Verifica que el Node version sea compatible (18 o 20)

---

## 📋 Checklist Final Antes de Publicar

- [ ] ✅ Iniciado sesión en Nullshot
- [ ] ✅ Proyecto "DeFi Guard IA" abierto y funcionando
- [ ] ✅ Build configuration correcta
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Código sincronizado con GitHub (si aplica)
- [ ] ✅ Screenshots preparados
- [ ] ✅ Video demo grabado (3-5 minutos)
- [ ] ✅ README completo y actualizado
- [ ] ✅ Tag "Nullshot Hacks S0" listo para agregar
- [ ] ✅ Descripción del producto escrita
- [ ] ✅ Enlaces (GitHub, Demo) preparados

---

## 📞 Contacto y Soporte

Si tienes problemas durante el proceso de publicación:

- **Email**: support@edenlayer.com
- **Discord**: [Nullshot Discord](https://discord.gg/nullshot)
- **Documentación**: [Nullshot Docs](https://nullshot.ai/en/docs)

---

## 🎉 ¡Éxito!

Una vez publicado, tu aplicación estará disponible en Nullshot Platform y podrás:
- ✅ Compartirla con la comunidad
- ✅ Enviarla al hackathon
- ✅ Obtener feedback de otros desarrolladores
- ✅ Participar en el Community Choice Award

**¡Buena suerte con tu submission! 🚀**

