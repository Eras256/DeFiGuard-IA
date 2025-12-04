# 🔧 Configuración de Gemini AI - Guía Rápida

## ✅ Verificar que la API Key está Configurada

1. **Asegúrate de que `.env.local` existe** en la raíz del proyecto
2. **Verifica que contiene:**
   ```bash
   GEMINI_API_KEY=tu_api_key_aqui
   ```
3. **Reinicia el servidor de desarrollo** después de agregar/modificar variables de entorno:
   ```bash
   # Detén el servidor (Ctrl+C)
   # Luego reinicia:
   npm run dev
   # o
   pnpm dev
   ```

## 🧪 Probar la Conexión

### Opción 1: Desde el Navegador
Visita: `http://localhost:3000/api/test-gemini`

Deberías ver una respuesta JSON con:
```json
{
  "success": true,
  "message": "Gemini AI is connected and working!",
  "modelUsed": "gemini-2.5-flash",
  ...
}
```

### Opción 2: Desde la Terminal
```bash
curl http://localhost:3000/api/test-gemini
```

### Opción 3: Componente de Estado
El componente `GeminiStatus` en la esquina superior derecha debería mostrar:
- ✅ **Connected** con el modelo usado (si funciona)
- ⚠️ **Checking...** (si está verificando)
- ❌ **Error** (si hay un problema)

## 🔍 Verificar Logs

Revisa la consola del servidor (donde ejecutas `npm run dev`). Deberías ver:

**Si la API key está configurada:**
```
✅ GEMINI_API_KEY loaded successfully
```

**Si falta la API key:**
```
⚠️ GEMINI_API_KEY is not set in environment variables
   Please add GEMINI_API_KEY to your .env.local file
   Get your API key from: https://aistudio.google.com/app/apikey
```

## 🐛 Solución de Problemas

### Error: "GEMINI_API_KEY is not set"
1. Verifica que `.env.local` existe en la raíz del proyecto
2. Verifica que contiene `GEMINI_API_KEY=tu_key`
3. **Reinicia el servidor de desarrollo** (importante)
4. Verifica que no hay espacios alrededor del `=`

### Error: "All models failed"
1. Verifica que tu API key es válida
2. Verifica tu conexión a internet
3. Revisa los logs del servidor para más detalles
4. Prueba obtener una nueva API key desde: https://aistudio.google.com/app/apikey

### El componente de estado muestra "Error"
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Busca la petición a `/api/test-gemini`
4. Revisa la respuesta para ver el error específico

## 📝 Obtener una API Key

1. Ve a: https://aistudio.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la clave generada
5. Agrégala a tu `.env.local`:
   ```bash
   GEMINI_API_KEY=tu_api_key_copiada_aqui
   ```

## ⚠️ Importante

- **NUNCA** compartas tu API key públicamente
- **NUNCA** hagas commit de `.env.local` al repositorio
- La API key solo funciona en el servidor (no se expone al cliente)
- Reinicia el servidor después de cambiar variables de entorno

## ✅ Verificación Final

Si todo está configurado correctamente:

1. ✅ El servidor muestra: `✅ GEMINI_API_KEY loaded successfully`
2. ✅ `/api/test-gemini` retorna `success: true`
3. ✅ El componente `GeminiStatus` muestra "Connected"
4. ✅ Puedes analizar contratos en `/audit`

---

*Última actualización: Diciembre 2025*

