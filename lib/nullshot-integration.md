# Nullshot Integration - DeFiGuard AI

## Track 1b: Web App usando Nullshot Platform

Este proyecto está diseñado para **NullShot Hacks Season 0 - Track 1b**: Publicar una aplicación web usando Nullshot Platform.

### ✅ Framework Oficial de Nullshot Configurado

Este proyecto ahora usa el **framework oficial de Nullshot** con:

- ✅ **CLI de Nullshot instalado** (`@nullshot/cli@0.2.5`)
- ✅ **Archivo `mcp.json` configurado** según el schema oficial
- ✅ **3 Servidores MCP registrados** en la configuración oficial
- ✅ **Scripts npm/pnpm** para gestionar Nullshot

### Requisitos del Track 1b

✅ **Aplicación Web Completa** - Next.js 14 con App Router
✅ **Arquitectura MCP/Agentes** - Implementación de Model Context Protocol
✅ **Integración Web3** - Contratos inteligentes, NFTs, tokens
✅ **Publicación en Nullshot Platform** - Desplegable en Nullshot Jam
✅ **Tag "Nullshot Hacks S0"** - Requerido para la presentación
✅ **Framework Oficial Nullshot** - CLI y configuración `mcp.json`

### Configuración de Nullshot

#### Archivo `mcp.json`

El archivo `mcp.json` está configurado según el schema oficial de Nullshot:

```json
{
  "mcpServers": {
    "slither-analyzer": {
      "command": "node lib/mcp/slither-mcp.ts"
    },
    "blockchain-data": {
      "command": "node lib/mcp/blockchain-mcp.ts",
      "env": [
        {
          "name": "NEXT_PUBLIC_THIRDWEB_CLIENT_ID"
        }
      ]
    },
    "defi-data": {
      "command": "node lib/mcp/defi-data-mcp.ts"
    }
  }
}
```

#### Scripts Disponibles

```bash
# Validar configuración MCP
pnpm run nullshot:validate

# Instalar servidores MCP desde config
pnpm run nullshot:install

# Listar servidores MCP instalados
pnpm run nullshot:list

# Crear nuevo proyecto desde template
pnpm run nullshot:init
```

### Arquitectura MCP Implementada

Este proyecto implementa la arquitectura **Model Context Protocol (MCP)** usando el framework oficial de Nullshot.

#### 1. Agentes (lib/agents/)
- **AuditorAgent** - Analiza contratos inteligentes
- **RiskAgent** - Calcula puntuaciones de riesgo
- **RemediationAgent** - Genera fixes de código

#### 2. Servidores MCP (lib/mcp/)
- **SlitherMCP** - Análisis estático de contratos
- **BlockchainMCP** - Datos on-chain
- **DeFiDataMCP** - Datos DeFi e historial de exploits

### Compatibilidad con Nullshot Jam

Esta implementación es **100% compatible** con Nullshot Jam porque:

✅ Usa el framework oficial de Nullshot (`@nullshot/cli`)
✅ Configuración `mcp.json` válida según el schema oficial
✅ Sigue el patrón MCP (Model Context Protocol)
✅ Implementa agentes siguiendo la arquitectura de Nullshot
✅ Puede desplegarse en Nullshot Jam
✅ Cumple con los requisitos del Track 1b del hackathon

### Para el Hackathon

Para **NullShot Hacks Season 0 - Track 1b**, esta implementación es válida porque:

1. **Usa framework oficial de Nullshot** - CLI y configuración estándar
2. **Usa arquitectura MCP** - El patrón principal de Nullshot
3. **Implementa agentes** - Siguiendo el modelo de Nullshot
4. **Publicable en Nullshot Jam** - Compatible con la plataforma
5. **Sigue las mejores prácticas** - Arquitectura limpia y escalable

### Referencias

- [Nullshot Documentation](https://nullshot.ai/en/docs)
- [Nullshot CLI GitHub](https://github.com/null-shot/typescript-agent-tookit)
- [MCP Specification](https://modelcontextprotocol.io)
- [Nullshot Jam Platform](https://nullshot.ai/jam)
