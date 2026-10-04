// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IE4CToken {
    function mintReward(address student, uint256 amount) external;
}

interface IStudentSkillNFT {
    function mintSkillBadge(
        address student,
        address teacher,
        address validator,
        string calldata skillName,
        string calldata category,
        string calldata evidenceURI,
        uint8 grade
    ) external returns (uint256);
}

/**
 * @title SkillVerificationHub
 * @notice Orquestador central para la tokenización de competencias en Monad.
 * Gestiona el ciclo completo: Solicitud del docente -> Aprobación del validador -> Minteo del SBT y Recompensa ERC-20.
 */
contract SkillVerificationHub {
    address public admin;
    IE4CToken public tokenContract;
    IStudentSkillNFT public nftContract;

    enum RequestStatus { None, PendingValidator, Approved, Rejected }

    struct SkillClaim {
        uint256 id;
        address student;
        address teacher;
        address validator;
        string skillName;
        string category;
        string evidenceURI;
        uint256 rewardAmount;
        uint8 grade;
        RequestStatus status;
        uint256 submittedAt;
        uint256 validatedAt;
        uint256 mintedTokenId;
    }

    uint256 public nextClaimId = 1;
    mapping(uint256 => SkillClaim) public claims;
    mapping(address => bool) public authorizedTeachers;
    mapping(address => bool) public authorizedValidators;

    event ClaimSubmitted(
        uint256 indexed claimId,
        address indexed student,
        address indexed teacher,
        string skillName,
        uint256 rewardAmount
    );

    event ClaimApproved(
        uint256 indexed claimId,
        address indexed student,
        address indexed validator,
        uint256 mintedTokenId,
        uint256 rewardAmount
    );

    event ClaimRejected(uint256 indexed claimId, address indexed validator, string reason);
    event RoleGranted(address indexed account, string role);
    event RoleRevoked(address indexed account, string role);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Hub: Only admin");
        _;
    }

    modifier onlyTeacher() {
        require(authorizedTeachers[msg.sender] || msg.sender == admin, "Hub: Only authorized teacher");
        _;
    }

    modifier onlyValidator() {
        require(authorizedValidators[msg.sender] || msg.sender == admin, "Hub: Only authorized validator");
        _;
    }

    constructor(address _tokenContract, address _nftContract) {
        admin = msg.sender;
        tokenContract = IE4CToken(_tokenContract);
        nftContract = IStudentSkillNFT(_nftContract);
    }

    function setContracts(address _tokenContract, address _nftContract) external onlyAdmin {
        tokenContract = IE4CToken(_tokenContract);
        nftContract = IStudentSkillNFT(_nftContract);
    }

    function setTeacher(address teacher, bool authorized) external onlyAdmin {
        authorizedTeachers[teacher] = authorized;
        if (authorized) emit RoleGranted(teacher, "TEACHER");
        else emit RoleRevoked(teacher, "TEACHER");
    }

    function setValidator(address validator, bool authorized) external onlyAdmin {
        authorizedValidators[validator] = authorized;
        if (authorized) emit RoleGranted(validator, "VALIDATOR");
        else emit RoleRevoked(validator, "VALIDATOR");
    }

    /**
     * @notice Un docente envía la acreditación de una habilidad completada por un estudiante.
     */
    function submitSkillClaim(
        address student,
        string calldata skillName,
        string calldata category,
        string calldata evidenceURI,
        uint256 rewardAmount,
        uint8 grade
    ) external onlyTeacher returns (uint256) {
        require(student != address(0), "Hub: Invalid student");

        uint256 claimId = nextClaimId++;
        claims[claimId] = SkillClaim({
            id: claimId,
            student: student,
            teacher: msg.sender,
            validator: address(0),
            skillName: skillName,
            category: category,
            evidenceURI: evidenceURI,
            rewardAmount: rewardAmount,
            grade: grade,
            status: RequestStatus.PendingValidator,
            submittedAt: block.timestamp,
            validatedAt: 0,
            mintedTokenId: 0
        });

        emit ClaimSubmitted(claimId, student, msg.sender, skillName, rewardAmount);
        return claimId;
    }

    /**
     * @notice Un validador aprueba la habilidad, desencadenando el minteo del SBT y la recompensa ERC-20.
     */
    function approveSkillClaim(uint256 claimId) external onlyValidator {
        SkillClaim storage claim = claims[claimId];
        require(claim.status == RequestStatus.PendingValidator, "Hub: Claim not pending");

        claim.status = RequestStatus.Approved;
        claim.validator = msg.sender;
        claim.validatedAt = block.timestamp;

        // 1. Mintear Soulbound NFT de la habilidad al estudiante
        uint256 tokenId = nftContract.mintSkillBadge(
            claim.student,
            claim.teacher,
            msg.sender,
            claim.skillName,
            claim.category,
            claim.evidenceURI,
            claim.grade
        );
        claim.mintedTokenId = tokenId;

        // 2. Transferir tokens de recompensa E4C al estudiante (si rewardAmount > 0)
        if (claim.rewardAmount > 0) {
            tokenContract.mintReward(claim.student, claim.rewardAmount);
        }

        emit ClaimApproved(claimId, claim.student, msg.sender, tokenId, claim.rewardAmount);
    }

    /**
     * @notice Un validador rechaza la acreditación con un motivo.
     */
    function rejectSkillClaim(uint256 claimId, string calldata reason) external onlyValidator {
        SkillClaim storage claim = claims[claimId];
        require(claim.status == RequestStatus.PendingValidator, "Hub: Claim not pending");

        claim.status = RequestStatus.Rejected;
        claim.validator = msg.sender;
        claim.validatedAt = block.timestamp;

        emit ClaimRejected(claimId, msg.sender, reason);
    }

    function getClaim(uint256 claimId) external view returns (SkillClaim memory) {
        return claims[claimId];
    }
}
