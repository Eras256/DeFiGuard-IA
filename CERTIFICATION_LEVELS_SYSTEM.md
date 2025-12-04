# 🏆 Sistema de Niveles de Certificación

## 📊 Niveles Disponibles

DeFiGuard IA implementa un sistema de **4 niveles de certificación** basado en el risk score del contrato:

### 💎 **Platino** (Nivel Máximo)
- **Risk Score:** 0-4
- **Descripción:** Seguridad excepcional, riesgo mínimo - Nivel de certificación más alto
- **Color:** Cyan
- **Icono:** 💎
- **Requisito:** Contratos con seguridad excepcional, prácticamente sin vulnerabilidades

### 🥇 **Oro** (Excelente)
- **Risk Score:** 5-14
- **Descripción:** Excelentes prácticas de seguridad, riesgo muy bajo
- **Color:** Amarillo
- **Icono:** 🥇
- **Requisito:** Contratos con muy buenas prácticas de seguridad

### 🥈 **Plata** (Muy Bueno)
- **Risk Score:** 15-24
- **Descripción:** Muy buenas prácticas de seguridad, riesgo bajo
- **Color:** Gris
- **Icono:** 🥈
- **Requisito:** Contratos con buenas prácticas de seguridad

### 🥉 **Bronce** (Bueno)
- **Risk Score:** 25-39
- **Descripción:** Buenas prácticas de seguridad, riesgo bajo-moderado
- **Color:** Naranja
- **Icono:** 🥉
- **Requisito:** Contratos con prácticas de seguridad aceptables

### ❌ **No Certificado**
- **Risk Score:** 40-100
- **Descripción:** El contrato no cumple con los requisitos de certificación
- **Requisito:** Score debe ser menor a 40 para ser elegible

---

## 🎯 Cómo Funciona

### 1. **Análisis del Contrato**
   - El usuario sube su contrato Solidity
   - Gemini AI analiza el código y genera un risk score (0-100)
   - El score se calcula basado en vulnerabilidades encontradas

### 2. **Determinación del Nivel**
   - El sistema determina automáticamente el nivel según el score:
     ```typescript
     if (score < 5) → Platino 💎
     else if (score < 15) → Oro 🥇
     else if (score < 25) → Plata 🥈
     else if (score < 40) → Bronce 🥉
     else → No Certificado ❌
     ```

### 3. **Certificación Automática**
   - Si el score es < 40, el contrato se certifica automáticamente al registrar el audit en blockchain
   - El nivel se determina según el score exacto obtenido

### 4. **NFT Badge**
   - Una vez certificado, el usuario puede mintear un NFT Badge
   - El badge muestra el nivel obtenido (Platino, Oro, Plata, o Bronce)
   - El badge es único y verificable en blockchain

---

## 💡 Ventajas del Sistema de Niveles

### ✅ **Motivación para Mejorar**
- Los desarrolladores tienen incentivos para mejorar su código
- Cada nivel representa un logro diferente
- Sistema de gamificación que fomenta mejores prácticas

### ✅ **Transparencia**
- Los usuarios pueden ver claramente qué nivel obtuvieron
- El sistema muestra qué se necesita para alcanzar el siguiente nivel
- Información clara sobre los requisitos de cada nivel

### ✅ **Diferenciación**
- Los contratos con mejor seguridad obtienen niveles más altos
- Los usuarios pueden distinguir entre diferentes niveles de calidad
- Sistema de reputación basado en seguridad

---

## 🔧 Implementación Técnica

### Archivos Creados/Modificados:

1. **`lib/constants/certification-levels.ts`**
   - Define los niveles y sus propiedades
   - Funciones helper para determinar niveles
   - Información de cada nivel (colores, iconos, descripciones)

2. **`components/shared/certification-badge.tsx`**
   - Componente reutilizable para mostrar badges de certificación
   - Variantes: default, compact, large
   - Muestra el nivel con su icono y color correspondiente

3. **`components/dashboard/certification-levels-info.tsx`**
   - Componente informativo que muestra todos los niveles
   - Explicación del sistema completo
   - Requisitos para cada nivel

4. **`components/audit/analysis-results.tsx`** (Modificado)
   - Muestra el nivel obtenido en el banner de elegibilidad
   - Botones y mensajes adaptados según el nivel
   - Sugerencias para alcanzar el siguiente nivel

5. **`components/dashboard/nft-badges.tsx`** (Modificado)
   - Muestra los badges con su nivel correspondiente
   - Diseño mejorado con colores y iconos según el nivel
   - Información detallada de cada badge

---

## 📱 Experiencia de Usuario

### Antes del Análisis:
- El usuario ve información sobre el sistema de niveles
- Entiende qué score necesita para cada nivel

### Después del Análisis:
- **Si score < 40:** 
  - Banner verde mostrando el nivel obtenido (Platino/Oro/Plata/Bronce)
  - Mensaje motivacional si puede mejorar al siguiente nivel
  - Botón destacado para registrar y obtener certificación

- **Si score >= 40:**
  - Banner rojo indicando que no es elegible
  - Mensaje explicando que necesita score < 40

### Después de Registrar:
- Muestra el nivel de certificación obtenido
- Botón para mintear NFT Badge con el nivel correspondiente
- Información detallada sobre el nivel

### En el Dashboard:
- Sección dedicada explicando todos los niveles
- Badges NFT mostrados con su nivel correspondiente
- Estadísticas sobre niveles obtenidos

---

## 🎨 Diseño Visual

Cada nivel tiene su propio esquema de colores:

- **💎 Platino:** Cyan brillante (`text-cyan-400`, `border-cyan-500`)
- **🥇 Oro:** Amarillo dorado (`text-yellow-400`, `border-yellow-500`)
- **🥈 Plata:** Gris plateado (`text-gray-300`, `border-gray-400`)
- **🥉 Bronce:** Naranja (`text-orange-400`, `border-orange-500`)

Los componentes usan estos colores para:
- Bordes de los cards
- Texto de títulos
- Fondos con transparencia
- Badges y etiquetas

---

## 🔮 Futuras Mejoras

### Posibles Extensiones:

1. **Sistema de Puntos de Reputación**
   - Acumular puntos por cada nivel obtenido
   - Leaderboard de desarrolladores más seguros

2. **Badges Especiales**
   - Badge "Primer Platino" para el primer contrato con score 0
   - Badges conmemorativos por hitos

3. **Mejora de Nivel**
   - Permitir re-auditar para mejorar el nivel
   - Sistema de upgrade de badges

4. **Estadísticas Avanzadas**
   - Gráficos de distribución de niveles
   - Comparación con otros desarrolladores
   - Tendencias de mejora

---

## 📝 Notas Importantes

- **Umbral Base:** El umbral mínimo para certificación sigue siendo **< 40**
- **Compatibilidad:** El sistema funciona con los contratos actuales sin necesidad de redeploy
- **Frontend Only:** La lógica de niveles está en el frontend; los contratos solo verifican score < 40
- **Futuro:** Para diferenciar niveles en blockchain, se podría agregar un campo `level` al NFT

---

*Última actualización: Diciembre 2025*
*Sistema implementado para NullShot Hacks Season 0 - Track 1b*

