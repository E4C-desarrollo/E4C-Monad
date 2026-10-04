---
name: monad-e4c
description: Guía y conjunto de herramientas para operar E4C en Monad blockchain, desplegar smart contracts de tokenización de habilidades (SBTs ERC-721 y recompensas ERC-20), y aplicar los tokens visuales y de red oficiales de Monad.
---

# Skill: Monad E4C - Tokenización de Habilidades Estudiantiles

Esta skill proporciona las directrices y herramientas para operar, desarrollar y desplegar la plataforma educativa **E4C (Edu-and-Chain)** sobre la blockchain **Monad**.

## 1. Parámetros de Red Oficiales (Monad Testnet)
- **Chain ID:** `10143` (Hex: `0x279f`)
- **RPC Primario:** `https://testnet-rpc.monad.xyz`
- **RPC Alternativo (Ankr):** `https://rpc.ankr.com/monad_testnet`
- **WebSocket:** `wss://testnet-rpc.monad.xyz`
- **Símbolo de Gas:** `MON` (18 decimales)
- **Explorador Monadscan:** `https://testnet.monadscan.com`
- **Explorador MonadVision:** `https://testnet.monadvision.com`
- **Faucet Oficial:** `https://faucet.monad.xyz`
- **App Portal:** `https://app.monad.xyz`

---

## 2. Smart Contracts del Ecosistema E4C

Ubicación: `contracts/`
- **`StudentSkillNFT.sol`**: Soulbound Token (SBT / ERC-721 intransferible). Representa los diplomas, acreditaciones y certificaciones de habilidades adquiridas por el estudiante.
- **`E4CToken.sol`**: Token fungible ERC-20 ($E4C). Puntos educativos canjeables en el marketplace escolar.
- **`SkillVerificationHub.sol`**: Contrato orquestador donde el docente somete la evidencia de la competencia y el validador aprueba y ejecuta el minteo on-chain en Monad.

### Comandos de Despliegue con Foundry:
```bash
# Desplegar Token
forge create contracts/E4CToken.sol:E4CToken --rpc-url https://testnet-rpc.monad.xyz --private-key $PRIVATE_KEY --constructor-args 1000000

# Desplegar SBT
forge create contracts/StudentSkillNFT.sol:StudentSkillNFT --rpc-url https://testnet-rpc.monad.xyz --private-key $PRIVATE_KEY

# Desplegar Hub Orquestador
forge create contracts/SkillVerificationHub.sol:SkillVerificationHub --rpc-url https://testnet-rpc.monad.xyz --private-key $PRIVATE_KEY --constructor-args $TOKEN_ADDR $NFT_ADDR
```

---

## 3. Identidad Visual y Diseño Monad
- **Colores Oficiales:**
  - Primario: `#6E54FF` (Monad Purple)
  - Hover: `#7259EA`
  - Fondos Oscuros: `#0E091C` (Dark Violet), `#05060A` (Metropolis Void)
  - Acentos: `#85E6FF` (Cyan), `#FF8EE4` (Berry Pink), `#FFAE45` (Orange)
- **Assets de Producción:**
  - `src/assets/monad/Logos/` (Logomark, Wordmark, Full Logo en SVG)
  - `src/assets/monad/Tokens/` (MON Token 32x32.svg y WMON)
  - `src/assets/monad/Monad Avatar PFP/` (Avatares oficiales en SVG y PNG)

---

## 4. Conectividad Web3 en el Frontend
- **Configuración de Red:** `src/lib/monad/chain.ts`
- **Conector de Billetera y Balances:** `src/lib/monad/provider.ts`
- **ABIs e Interfaz de Contratos:** `src/lib/monad/contracts.ts`
- **Componentes UI:** `src/components/shared/MonadConnectButton.tsx` y `src/components/shared/MonadBadge.tsx`
