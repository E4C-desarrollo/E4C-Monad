# Contratos Inteligentes E4C en Monad (Solidity)

Este directorio contiene los smart contracts para la **tokenización de habilidades y certificaciones estudiantiles** en la red **Monad**.

---

## Arquitectura de Contratos

```
                      +-----------------------------+
                      |   SkillVerificationHub      |
                      |   (Coordinador de Roles)    |
                      +--------------+--------------+
                                     |
             +-----------------------+-----------------------+
             |                                               |
             v                                               v
+---------------------------+                   +---------------------------+
|      StudentSkillNFT      |                   |         E4CToken          |
|  (Soulbound Token - SBT)  |                   |   (ERC-20 Skill Points)   |
|   Insignias y Diplomas    |                   |  Recompensas por Tareas   |
+---------------------------+                   +---------------------------+
```

### 1. `StudentSkillNFT.sol` (Soulbound Token - ERC-721)
- **Propósito:** Certificados de competencias e insignias estudiantiles digitales intransferibles.
- **Seguridad:** Bloquea funciones de transferencia (`transferFrom`, `safeTransferFrom`, `approve`) para evitar la venta o cesión de títulos.
- **Datos on-chain:**
  - `skillName`: Nombre de la competencia (ej. "Programación Web con React y Web3").
  - `category`: Categoría ("achievement", "excellence", "participation").
  - `evidenceURI`: Enlace o hash IPFS a la evidencia presentada por el estudiante.
  - `student`, `teacher`, `validator`: Direcciones participantes con registro inmutable.
  - `issuedDate`: Timestamp de acuñación.
  - `grade`: Calificación del 1 al 100.

### 2. `E4CToken.sol` (Token ERC-20)
- **Propósito:** Token fungible de recompensa y créditos educativos ($E4C).
- **Mecánica:** Los estudiantes ganan tokens al completar tareas escolares validadas, los cuales pueden canjear en el Marketplace por recompensas educativas o beneficios de partners.

### 3. `SkillVerificationHub.sol` (Orquestador)
- **Propósito:** Administra el flujo descentralizado de acreditación educativa:
  1. El docente (`TEACHER`) evalúa la tarea y envía la solicitud `submitSkillClaim(...)`.
  2. El validador institucional (`VALIDATOR`) revisa la evidencia y aprueba con `approveSkillClaim(claimId)`.
  3. El Hub automáticamente acuña el **SBT** al estudiante y emite los tokens **$E4C** en una única transacción de alta velocidad en Monad.

---

## Despliegue en Monad Testnet

### Parámetros de Red
- **RPC URL:** `https://testnet-rpc.monad.xyz`
- **Chain ID:** `10143`
- **Símbolo:** `MON`
- **Explorador:** `https://testnet.monadscan.com`

### Opción A: Despliegue con Foundry
```bash
# 1. Instalar Foundry (si no lo tienes)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 2. Desplegar E4CToken
forge create contracts/E4CToken.sol:E4CToken \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key $PRIVATE_KEY \
  --constructor-args 1000000

# 3. Desplegar StudentSkillNFT
forge create contracts/StudentSkillNFT.sol:StudentSkillNFT \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key $PRIVATE_KEY

# 4. Desplegar SkillVerificationHub vinculando los dos anteriores
forge create contracts/SkillVerificationHub.sol:SkillVerificationHub \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key $PRIVATE_KEY \
  --constructor-args $E4C_TOKEN_ADDRESS $SKILL_NFT_ADDRESS

# 5. Autorizar al Hub en el Token y en el NFT
cast send $E4C_TOKEN_ADDRESS "setMinter(address,bool)" $HUB_ADDRESS true --rpc-url https://testnet-rpc.monad.xyz --private-key $PRIVATE_KEY
cast send $SKILL_NFT_ADDRESS "setHub(address)" $HUB_ADDRESS --rpc-url https://testnet-rpc.monad.xyz --private-key $PRIVATE_KEY
```

### Opción B: Despliegue con Remix
1. Abre [https://remix.ethereum.org](https://remix.ethereum.org).
2. Carga los archivos `.sol` de esta carpeta.
3. En el panel de despliegue, selecciona el entorno **"Injected Provider - MetaMask"**.
4. Asegúrate de estar conectado a **Monad Testnet** (Chain ID: 10143).
5. Despliega en orden: `E4CToken`, `StudentSkillNFT` y luego `SkillVerificationHub`.
6. En `E4CToken`, ejecuta `setMinter(direccion_del_hub, true)`.
7. En `StudentSkillNFT`, ejecuta `setHub(direccion_del_hub)`.
