// scripts/compile.js
import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contractsDir = path.resolve(__dirname, '../contracts');
const artifactsDir = path.resolve(contractsDir, 'artifacts');

if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

const sources = {
  'E4CToken.sol': {
    content: fs.readFileSync(path.join(contractsDir, 'E4CToken.sol'), 'utf8'),
  },
  'StudentSkillNFT.sol': {
    content: fs.readFileSync(path.join(contractsDir, 'StudentSkillNFT.sol'), 'utf8'),
  },
  'SkillVerificationHub.sol': {
    content: fs.readFileSync(path.join(contractsDir, 'SkillVerificationHub.sol'), 'utf8'),
  },
};

const input = {
  language: 'Solidity',
  sources,
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

console.log('Compilando contratos con Solidity', solc.version(), '...');

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  let hasError = false;
  output.errors.forEach((err) => {
    if (err.severity === 'error') {
      hasError = true;
      console.error('ERROR:', err.formattedMessage);
    } else {
      console.warn('WARN:', err.formattedMessage);
    }
  });
  if (hasError) {
    process.exit(1);
  }
}

const compiledContracts = {};

for (const [file, contracts] of Object.entries(output.contracts)) {
  for (const [name, contract] of Object.entries(contracts)) {
    const artifact = {
      contractName: name,
      sourceName: file,
      abi: contract.abi,
      bytecode: contract.evm.bytecode.object,
    };
    const artifactPath = path.join(artifactsDir, `${name}.json`);
    fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));
    compiledContracts[name] = artifact;
    console.log(`✓ Compilado: ${name} -> ${artifactPath}`);
  }
}

console.log('¡Compilación completada exitosamente!');
