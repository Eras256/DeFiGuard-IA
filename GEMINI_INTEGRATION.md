# 🤖 Integración de Gemini AI - DeFiGuard IA

## ✅ Implementación Completa

La integración de Google Gemini AI está completamente implementada con sistema de fallback multi-modelo y manejo robusto de errores.

---

## 🔧 Configuración

### Variables de Entorno

Agrega a tu archivo `.env.local`:

```bash
# Google Gemini API Key
# Obtén tu clave en: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=tu_api_key_aqui
```

### Para Producción (Vercel)

1. **Agregar variable en Vercel Dashboard:**
   ```bash
   vercel env add GEMINI_API_KEY
   ```

2. **O desde el dashboard:**
   - Ve a `Settings > Environment Variables`
   - Agrega `GEMINI_API_KEY` con tu clave
   - Selecciona para Production, Preview y Development

3. **Sincronizar localmente:**
   ```bash
   vercel env pull .env.local
   ```

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## 🏗️ Arquitectura

### Sistema de Fallback Multi-Modelo

El sistema intenta modelos en este orden hasta que uno funciona:

1. ✅ `gemini-2.5-flash` - Principal (más rápido y económico)
2. ✅ `gemini-2.5-pro` - Fallback 1 (más preciso)
3. ✅ `gemini-2.0-flash` - Fallback 2
4. ✅ `gemini-1.5-flash` - Fallback 3
5. ✅ `gemini-1.5-pro` - Fallback 4 (más robusto)

### Archivos Principales

- **`lib/ai/gemini-advanced.ts`** - Helper avanzado con fallback multi-modelo
- **`lib/gemini/client.ts`** - Cliente actualizado con fallback
- **`app/api/analyze/route.ts`** - Endpoint de análisis de contratos
- **`app/api/gemini/route.ts`** - Endpoint genérico de Gemini
- **`app/api/test-gemini/route.ts`** - Endpoint de prueba

---

## 📡 API Endpoints

### 1. Analizar Contrato (`POST /api/analyze`)

Analiza un contrato Solidity para vulnerabilidades.

**Request:**
```json
{
  "code": "pragma solidity ^0.8.0; contract MyContract { ... }"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vulnerabilities": [...],
    "riskScore": 75,
    "gasOptimizations": [...],
    "bestPractices": [...],
    "summary": "..."
  }
}
```

### 2. Llamada Genérica (`POST /api/gemini`)

Llamada genérica a Gemini con fallback.

**Request:**
```json
{
  "code": "contract code here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "modelUsed": "gemini-2.5-flash"
}
```

### 3. Prueba de Conectividad (`GET /api/test-gemini`)

Valida que Gemini AI está funcionando.

**Response:**
```json
{
  "success": true,
  "message": "Gemini AI is connected and working!",
  "modelUsed": "gemini-2.5-flash",
  "response": "...",
  "timestamp": "2025-12-..."
}
```

---

## 💻 Uso en el Código

### Análisis de Contrato

```typescript
import { analyzeContractWithGemini } from "@/lib/gemini/client";

const code = `pragma solidity ^0.8.0; contract MyContract { ... }`;

try {
  const analysis = await analyzeContractWithGemini(code);
  console.log(`Risk Score: ${analysis.riskScore}`);
  console.log(`Vulnerabilities: ${analysis.vulnerabilities.length}`);
} catch (error) {
  console.error("Analysis failed:", error);
}
```

### Usando Helper Avanzado

```typescript
import { callGemini, callGeminiJSON } from "@/lib/ai/gemini-advanced";

// Llamada simple
const response = await callGemini("Your prompt here", {
  temperature: 0.7,
  maxOutputTokens: 1024,
});

if (response.success) {
  console.log("Response:", response.data);
  console.log("Model used:", response.modelUsed);
} else {
  console.error("Error:", response.error);
}

// Llamada con JSON parsing
const jsonResponse = await callGeminiJSON<MyType>("Prompt that returns JSON");
```

### Generar Código de Remediación

```typescript
import { generateRemediationCode } from "@/lib/ai/gemini-advanced";

const response = await generateRemediationCode(originalCode, {
  type: "Reentrancy",
  line: 42,
  description: "Reentrancy vulnerability detected",
});

if (response.success) {
  const fixedCode = response.data;
  // Usar código corregido
}
```

---

## 🔒 Seguridad

- ✅ **API Key nunca expuesta al cliente** - Todo se ejecuta server-side
- ✅ **Validación de API key** - Verifica que existe antes de usar
- ✅ **Manejo de errores robusto** - No expone información sensible
- ✅ **Runtime Node.js** - Forzado en todas las rutas para Vercel

---

## 🐛 Debugging

### Verificar que la API Key está configurada

```bash
# En desarrollo
echo $GEMINI_API_KEY

# En producción (Vercel)
vercel env ls
```

### Probar conectividad

```bash
# GET request
curl http://localhost:3000/api/test-gemini

# POST request con prompt personalizado
curl -X POST http://localhost:3000/api/test-gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Say hello"}'
```

### Ver logs

Los logs muestran qué modelo se está usando:

```
[AI] Attempting to use model: gemini-2.5-flash
[AI] ✅ Successfully used model: gemini-2.5-flash
```

Si un modelo falla:

```
[AI] ⚠️ Model gemini-2.5-flash failed: Error message
[AI] Attempting to use model: gemini-2.5-pro
```

---

## 📊 Configuración de Generación

### Parámetros Recomendados

**Análisis de Contratos:**
```typescript
{
  temperature: 0.2,      // Bajo para respuestas más determinísticas
  topP: 0.95,            // Alto para diversidad controlada
  topK: 40,              // Balance entre calidad y velocidad
  maxOutputTokens: 8192 // Largo para análisis completos
}
```

**Generación de Código:**
```typescript
{
  temperature: 0.3,      // Bajo-medio para código preciso
  maxOutputTokens: 4096  // Suficiente para código completo
}
```

**Explicaciones:**
```typescript
{
  temperature: 0.7,      // Medio-alto para respuestas naturales
  maxOutputTokens: 2048  // Suficiente para explicaciones
}
```

---

## ✅ Checklist de Implementación

- [x] Instalar `@google/generative-ai`
- [x] Configurar `GEMINI_API_KEY` en `.env.local`
- [x] Crear helper con instancia única de `GoogleGenerativeAI`
- [x] Implementar fallback multi-modelo con manejo de errores
- [x] Crear API routes que usen el helper
- [x] Declarar `export const runtime = 'nodejs'` en rutas
- [x] Construir prompts estructurados que soliciten JSON
- [x] Extraer y parsear JSON de respuestas (manejando markdown)
- [x] Validar datos antes de retornar
- [x] Implementar timeouts en cliente con `AbortController`
- [x] Manejar estados de carga/error en UI
- [x] Convertir BigInt a string para serialización
- [x] Crear endpoint de prueba `/api/test-gemini`
- [x] Retornar formato uniforme `{ success, data, error }`
- [x] Loggear modelo usado para debugging
- [x] Asegurar que API key nunca se exponga al cliente

---

## 🚀 Estado Actual

✅ **Completamente Implementado**

- Sistema de fallback multi-modelo funcionando
- Validación de API key
- Manejo robusto de errores
- Endpoints de API listos
- Logging para debugging
- Formato uniforme de respuestas
- Runtime Node.js configurado para Vercel

---

## 📚 Recursos

- [Google AI Studio](https://aistudio.google.com/app/apikey) - Obtener API Key
- [Gemini API Documentation](https://ai.google.dev/docs) - Documentación oficial
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) - Configurar en producción

---

*Última actualización: Diciembre 2025*

