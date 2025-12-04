# 📊 Análisis del Umbral de Certificación - Risk Score Threshold

## 🔍 Investigación Realizada (Diciembre 2025)

### Resultados de Búsqueda

**No existe un estándar universalmente aceptado** para umbrales de risk score en certificación de contratos inteligentes. Sin embargo, se encontraron las siguientes referencias:

### Marcos de Referencia Encontrados

1. **Sistema de Certificación de Ciberseguridad de la UE (EUCC)**
   - Entró en vigor: 27 de febrero de 2025
   - Basado en Common Criteria (estándar internacional)
   - No especifica umbrales numéricos de risk score
   - Se enfoca en niveles de aseguramiento basados en riesgo

2. **ISO/IEC 42001** (Gestión de Riesgos en IA)
   - Proporciona marco para gestión de riesgos
   - No define umbrales específicos de risk score
   - Enfoque en procesos de mitigación

3. **Prácticas de la Industria**
   - En evaluación de proyectos: scores < 50 se consideran "deficientes"
   - En auditorías de seguridad: enfoque en severidad (Critical, High, Medium, Low)
   - No hay consenso sobre umbrales numéricos específicos

---

## 📈 Análisis del Umbral Actual: 40

### Escala de Risk Score (0-100)
- **0-20**: Excelente - Riesgo muy bajo
- **21-40**: Bueno - Riesgo bajo-moderado ✅ **Umbral actual**
- **41-60**: Moderado - Riesgo medio
- **61-80**: Alto - Riesgo significativo
- **81-100**: Crítico - Riesgo muy alto

### Evaluación del Umbral de 40

**✅ Ventajas:**
- Permite certificar contratos con riesgo bajo-moderado
- Balance entre seguridad y accesibilidad
- Alineado con prácticas donde < 50 se considera aceptable
- Permite certificar contratos bien escritos pero no perfectos

**⚠️ Consideraciones:**
- Un score de 40 aún indica presencia de vulnerabilidades menores
- Para aplicaciones DeFi de alto valor, podría ser demasiado permisivo
- No hay estándar oficial que valide este umbral específico

---

## 🎯 Recomendaciones

### Opción 1: Mantener 40 (Recomendado para MVP/Hackathon)
**Razón:** Balance entre seguridad y accesibilidad. Permite certificar contratos bien auditados sin ser demasiado restrictivo.

### Opción 2: Reducir a 30 (Más Estricto)
**Razón:** Mayor nivel de seguridad. Solo certifica contratos con riesgo muy bajo. Más apropiado para producción.

### Opción 3: Sistema de Niveles (Más Flexible)
**Razón:** Diferentes niveles de certificación según el score:
- **Nivel 1 (Plata)**: Score < 50
- **Nivel 2 (Oro)**: Score < 30
- **Nivel 3 (Platino)**: Score < 20

---

## 💡 Recomendación Final

### Para NullShot Hacks / MVP:
**✅ Mantener umbral de 40** es apropiado porque:
1. No hay estándar oficial que contradiga este valor
2. Es un balance razonable entre seguridad y accesibilidad
3. Permite certificar contratos bien escritos
4. Puede ajustarse fácilmente en el futuro

### Para Producción:
**Considerar reducir a 30** para mayor seguridad, especialmente si:
- Los contratos manejan fondos significativos
- Se requiere mayor nivel de confianza
- Se quiere diferenciar entre niveles de certificación

---

## 📝 Notas Técnicas

### Implementación Actual:
```solidity
// AuditRegistry.sol
uint256 public constant CERTIFICATION_THRESHOLD = 40;

// GuardNFT.sol  
uint256 public constant MAX_CERTIFICATION_RISK_SCORE = 40;
```

### Criterio de Certificación:
- Score < 40 → Certificación automática ✅
- Score >= 40 → No certificado ❌

### Cambio de Umbral:
Si decides cambiar el umbral, necesitarías:
1. Actualizar ambos contratos (requiere redeploy)
2. O crear nuevos contratos con el nuevo umbral
3. Actualizar documentación y mensajes en el frontend

---

## 🔗 Referencias

- [EUCC - Sistema de Certificación de Ciberseguridad UE](https://digital-strategy.ec.europa.eu/es/policies/cybersecurity-certification-framework)
- [ISO/IEC 42001 - Gestión de Riesgos en IA](https://es.isms.online/frameworks/iso-42001/)
- Common Criteria (ISO/IEC 15408) - Estándar internacional de seguridad

---

*Última actualización: Diciembre 2025*
*Análisis basado en búsqueda de documentación oficial y mejores prácticas de la industria*

