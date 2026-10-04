// scripts/deploy-monad.js
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC_URL = process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';
const CHAIN_ID = 10143;

// Leer .env manualmente si existe
const envPath = path.resolve(__dirname, '../.env');
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

function getEnvVar(key) {
  if (process.env[key]) return process.env[key];
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].replace(/["']/g, '').trim() : null;
}

async function main() {
  console.log('========================================================');
  console.log('       DESPLIEGUE DE CONTRATOS E4C EN MONAD TESTNET     ');
  console.log('========================================================');
  console.log(`RPC: ${RPC_URL}`);
  console.log(`Chain ID: ${CHAIN_ID}`);

  let privateKey = getEnvVar('MONAD_PRIVATE_KEY');

  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    chainId: CHAIN_ID,
    name: 'monad-testnet',
  });

  if (!privateKey) {
    console.log('\n[!] No se encontró MONAD_PRIVATE_KEY en .env');
    console.log('Generando una nueva billetera de despliegue para este proyecto...');
    const randomWallet = ethers.Wallet.createRandom();
    console.log('\n--------------------------------------------------------');
    console.log(`Dirección pública: ${randomWallet.address}`);
    console.log(`Clave privada:     ${randomWallet.privateKey}`);
    console.log('--------------------------------------------------------');
    console.log('\nPor favor:');
    console.log('1. Guarda la clave privada agregando a tu archivo .env:');
    console.log(`   MONAD_PRIVATE_KEY="${randomWallet.privateKey}"`);
    console.log('2. Solicita fondos MON para pagar el gas en el Faucet:');
    console.log(`   https://faucet.monad.xyz (Dirección: ${randomWallet.address})`);
    console.log('3. Vuelve a ejecutar este script de despliegue.\n');

    // Preguntar si queremos guardarla automáticamente en .env
    const updatedEnv = envContent.trim() + `\nMONAD_PRIVATE_KEY="${randomWallet.privateKey}"\n`;
    fs.writeFileSync(envPath, updatedEnv, 'utf8');
    console.log('✓ Se guardó automáticamente la clave en .env');
    privateKey = randomWallet.privateKey;
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`\nDeployer Address: ${wallet.address}`);

  let balance = await provider.getBalance(wallet.address);
  let balanceEth = ethers.formatEther(balance);
  console.log(`Balance actual:   ${balanceEth} MON`);

  if (balance === 0n) {
    console.log('\n⏳ Esperando fondos de prueba en Monad Testnet...');
    console.log(`Por favor envía MON de prueba o usa https://faucet.monad.xyz`);
    console.log(`Dirección: ${wallet.address}`);
    console.log('Escuchando la red cada 5 segundos...');

    while (balance === 0n) {
      await new Promise((r) => setTimeout(r, 5000));
      balance = await provider.getBalance(wallet.address);
      if (balance > 0n) {
        balanceEth = ethers.formatEther(balance);
        console.log(`\n🎉 ¡Fondos detectados! Balance: ${balanceEth} MON`);
        break;
      }
      process.stdout.write('.');
    }
  }

  // Cargar artefactos compilados
  const artifactsDir = path.resolve(__dirname, '../contracts/artifacts');
  const e4cTokenArtifact = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'E4CToken.json'), 'utf8'));
  const skillNftArtifact = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'StudentSkillNFT.json'), 'utf8'));
  const hubArtifact = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'SkillVerificationHub.json'), 'utf8'));

  console.log('\n--- 1. Desplegando E4CToken (ERC-20) ---');
  const TokenFactory = new ethers.ContractFactory(e4cTokenArtifact.abi, e4cTokenArtifact.bytecode, wallet);
  const initialSupply = 1000000n; // 1M tokens
  const tokenContract = await TokenFactory.deploy(initialSupply);
  await tokenContract.waitForDeployment();
  const tokenAddress = await tokenContract.getAddress();
  console.log(`✓ E4CToken desplegado en: ${tokenAddress}`);
  console.log(`  Ver en Monadscan: https://testnet.monadscan.com/token/${tokenAddress}`);

  console.log('\n--- 2. Desplegando StudentSkillNFT (Soulbound ERC-721) ---');
  const NftFactory = new ethers.ContractFactory(skillNftArtifact.abi, skillNftArtifact.bytecode, wallet);
  const nftContract = await NftFactory.deploy();
  await nftContract.waitForDeployment();
  const nftAddress = await nftContract.getAddress();
  console.log(`✓ StudentSkillNFT desplegado en: ${nftAddress}`);
  console.log(`  Ver en Monadscan: https://testnet.monadscan.com/token/${nftAddress}`);

  console.log('\n--- 3. Desplegando SkillVerificationHub ---');
  const HubFactory = new ethers.ContractFactory(hubArtifact.abi, hubArtifact.bytecode, wallet);
  const hubContract = await HubFactory.deploy(tokenAddress, nftAddress);
  await hubContract.waitForDeployment();
  const hubAddress = await hubContract.getAddress();
  console.log(`✓ SkillVerificationHub desplegado en: ${hubAddress}`);
  console.log(`  Ver en Monadscan: https://testnet.monadscan.com/address/${hubAddress}`);

  console.log('\n--- 4. Configurando permisos e integración ---');
  console.log('Autorizando al Hub como minter en E4CToken...');
  const tx1 = await tokenContract.setMinter(hubAddress, true);
  await tx1.wait();
  console.log('✓ Hub autorizado como minter en E4CToken');

  console.log('Autorizando al Hub en StudentSkillNFT...');
  const tx2 = await nftContract.setHub(hubAddress);
  await tx2.wait();
  console.log('✓ Hub autorizado en StudentSkillNFT');

  // Actualizar src/lib/monad/contracts.ts con las direcciones
  console.log('\n--- 5. Actualizando configuración del Frontend ---');
  const contractsTsPath = path.resolve(__dirname, '../src/lib/monad/contracts.ts');
  let contractsTs = fs.readFileSync(contractsTsPath, 'utf8');
  contractsTs = contractsTs.replace(
    /E4C_TOKEN:\s*import\.meta\.env\.VITE_MONAD_E4C_TOKEN_ADDRESS\s*\|\|\s*'0x[0-9a-fA-F]+'/,
    `E4C_TOKEN: import.meta.env.VITE_MONAD_E4C_TOKEN_ADDRESS || '${tokenAddress}'`
  );
  contractsTs = contractsTs.replace(
    /STUDENT_SKILL_NFT:\s*import\.meta\.env\.VITE_MONAD_SKILL_NFT_ADDRESS\s*\|\|\s*'0x[0-9a-fA-F]+'/,
    `STUDENT_SKILL_NFT: import.meta.env.VITE_MONAD_SKILL_NFT_ADDRESS || '${nftAddress}'`
  );
  contractsTs = contractsTs.replace(
    /SKILL_VERIFICATION_HUB:\s*import\.meta\.env\.VITE_MONAD_HUB_ADDRESS\s*\|\|\s*'0x[0-9a-fA-F]+'/,
    `SKILL_VERIFICATION_HUB: import.meta.env.VITE_MONAD_HUB_ADDRESS || '${hubAddress}'`
  );
  fs.writeFileSync(contractsTsPath, contractsTs, 'utf8');
  console.log(`✓ Direcciones guardadas en src/lib/monad/contracts.ts`);

  console.log('\n========================================================');
  console.log('          ¡DESPLIEGUE FINALIZADO CON ÉXITO!             ');
  console.log('========================================================');
  console.log(`E4CToken:             ${tokenAddress}`);
  console.log(`StudentSkillNFT:      ${nftAddress}`);
  console.log(`SkillVerificationHub: ${hubAddress}`);
  console.log('========================================================\n');
}

main().catch((err) => {
  console.error('\nError durante el despliegue:', err);
  process.exit(1);
});
