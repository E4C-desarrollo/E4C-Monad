// src/lib/monad/contracts.ts

export const MONAD_CONTRACT_ADDRESSES = {
  // Direcciones desplegadas en Monad Testnet (o variables de entorno)
  E4C_TOKEN: import.meta.env.VITE_MONAD_E4C_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  STUDENT_SKILL_NFT: import.meta.env.VITE_MONAD_SKILL_NFT_ADDRESS || '0x0000000000000000000000000000000000000000',
  SKILL_VERIFICATION_HUB: import.meta.env.VITE_MONAD_HUB_ADDRESS || '0x0000000000000000000000000000000000000000',
};

export const E4C_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function mintReward(address student, uint256 amount) external",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export const STUDENT_SKILL_NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address account) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getStudentBadges(address student) view returns (uint256[])",
  "function getBadgeDetails(uint256 tokenId) view returns (tuple(uint256 tokenId, string skillName, string category, string evidenceURI, address student, address teacher, address validator, uint256 issuedDate, uint8 grade))",
  "function mintSkillBadge(address student, address teacher, address validator, string skillName, string category, string evidenceURI, uint8 grade) returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event SkillBadgeMinted(uint256 indexed tokenId, address indexed student, address indexed validator, string skillName, string category)"
];

export const SKILL_VERIFICATION_HUB_ABI = [
  "function submitSkillClaim(address student, string skillName, string category, string evidenceURI, uint256 rewardAmount, uint8 grade) returns (uint256)",
  "function approveSkillClaim(uint256 claimId) external",
  "function rejectSkillClaim(uint256 claimId, string reason) external",
  "function getClaim(uint256 claimId) view returns (tuple(uint256 id, address student, address teacher, address validator, string skillName, string category, string evidenceURI, uint256 rewardAmount, uint8 grade, uint8 status, uint256 submittedAt, uint256 validatedAt, uint256 mintedTokenId))",
  "event ClaimSubmitted(uint256 indexed claimId, address indexed student, address indexed teacher, string skillName, uint256 rewardAmount)",
  "event ClaimApproved(uint256 indexed claimId, address indexed student, address indexed validator, uint256 mintedTokenId, uint256 rewardAmount)",
  "event ClaimRejected(uint256 indexed claimId, address indexed validator, string reason)"
];
