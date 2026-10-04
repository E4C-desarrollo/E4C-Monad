# MONAD.md

Este archivo contiene mandatos fundamentales, recursos prioritarios y directrices técnicas para el desarrollo de E4C en **Monad**.

## Recursos Oficiales y Documentación de Monad
- **Portal Oficial:** https://monad.xyz
- **Brand & Media Kit:** https://monad.xyz/brand-and-media-kit
- **App Hub / Portal:** https://app.monad.xyz
- **Documentación para Desarrolladores:** https://docs.monad.xyz
- **Índice para Modelos de IA:** https://docs.monad.xyz/llms.txt

---

## Parámetros de Red (Monad Testnet)
| Parámetro | Valor |
|---|---|
| **Network Name** | Monad Testnet |
| **Chain ID** | `10143` (Hex: `0x279f`) |
| **Currency Symbol** | `MON` (18 decimales) |
| **Public RPC 1 (QuickNode)** | `https://testnet-rpc.monad.xyz` |
| **WebSocket RPC** | `wss://testnet-rpc.monad.xyz` |
| **Public RPC 2 (Ankr)** | `https://rpc.ankr.com/monad_testnet` |
| **Block Explorer (Monadscan)** | `https://testnet.monadscan.com` |
| **Block Explorer (MonadVision)** | `https://testnet.monadvision.com` |
| **Official Faucet** | `https://faucet.monad.xyz` |
| **Live Network Visualizer** | `https://www.gmonads.com/?network=testnet` |

---

## Arquitectura y Mandatos de Desarrollo

### 1. Smart Contracts (EVM Compatible)
- Monad es 100% compatible con EVM (Bytecode y Tooling estándar: Foundry, Hardhat, Remix).
- **Tokenización de Habilidades (E4C):**
  - **Insignias de Mérito / Certificaciones:** Implementar como tokens no transferibles (Soulbound Tokens / SBTs basados en ERC-721 o ERC-1155). Un estudiante no puede transferir su certificación a otro usuario.
  - **Puntos / Créditos Educativos ($E4C):** Token ERC-20 distribuido al completar tareas pedagógicas y validaciones.
  - **Centro de Verificación:** Contrato coordinador con roles (`STUDENT`, `TEACHER`, `VALIDATOR`) que emite la insignia on-chain tras la firma del validador.
- **Eficiencia:** Aprovechar la ejecución paralela y optimizaciones de estado de MonadDb evitando cuellos de botella de contención de almacenamiento masivo en una única ranura si no es necesario.

### 2. Frontend & Web3
- Utilizar `viem` / `wagmi` / proveedores EVM estándar con el Chain ID `10143`.
- Implementar flujo fluido de detección de red con `wallet_switchEthereumChain` y `wallet_addEthereumChain`.
- Mantener compatibilidad con Passkeys / WebAuthn aprovechando la compatibilidad nativa con **EIP-7702** en Monad.

### 3. Identidad Visual y Branding
- **Color Primario:** `#6E54FF` (Monad Purple).
- **Fondos Oscuros:** `#0E091C` (Dark Violet), `#05060A` (Metropolis Void).
- **Acentos:** `#85E6FF` (Cyan), `#FF8EE4` (Berry Pink), `#FFAE45` (Vibrant Orange), `#DDD7FE` (Lavender Tint).
- **Tipografía:**
  - Títulos: *Britti Sans* / *Inter*
  - Código, hashes, wallets y balances: *Roboto Mono*
- **Assets:** Utilizar los logos y tokens SVG oficiales ubicados en `src/assets/monad/` y `src/Monad Brand and Media Kit/`.
