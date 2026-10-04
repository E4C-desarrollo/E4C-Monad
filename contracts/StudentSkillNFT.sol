// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StudentSkillNFT
 * @notice Certificaciones de Habilidades Estudiantiles en Monad como Soulbound Tokens (SBT).
 * Los tokens son intransferibles para garantizar la autenticidad del logro educativo del estudiante.
 */
contract StudentSkillNFT {
    string public name = "E4C Student Skill Badges";
    string public symbol = "E4C-SKILL";

    address public owner;
    address public hub;
    uint256 public nextTokenId = 1;

    struct SkillBadge {
        uint256 tokenId;
        string skillName;
        string category; // "achievement" | "excellence" | "participation"
        string evidenceURI;
        address student;
        address teacher;
        address validator;
        uint256 issuedDate;
        uint8 grade;
    }

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => SkillBadge) public badges;
    mapping(address => uint256[]) private _studentBadges;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event SkillBadgeMinted(
        uint256 indexed tokenId,
        address indexed student,
        address indexed validator,
        string skillName,
        string category
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "StudentSkillNFT: Only owner");
        _;
    }

    modifier onlyHub() {
        require(msg.sender == hub || msg.sender == owner, "StudentSkillNFT: Only hub or owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setHub(address _hub) external onlyOwner {
        hub = _hub;
    }

    function balanceOf(address account) external view returns (uint256) {
        require(account != address(0), "StudentSkillNFT: Address zero");
        return _balances[account];
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "StudentSkillNFT: Nonexistent token");
        return tokenOwner;
    }

    function getStudentBadges(address student) external view returns (uint256[] memory) {
        return _studentBadges[student];
    }

    function getBadgeDetails(uint256 tokenId) external view returns (SkillBadge memory) {
        require(_owners[tokenId] != address(0), "StudentSkillNFT: Nonexistent token");
        return badges[tokenId];
    }

    /**
     * @notice Emite una nueva insignia de habilidad a un estudiante.
     * Solo puede ser invocada por el SkillVerificationHub tras la validación aprobada.
     */
    function mintSkillBadge(
        address student,
        address teacher,
        address validator,
        string calldata skillName,
        string calldata category,
        string calldata evidenceURI,
        uint8 grade
    ) external onlyHub returns (uint256) {
        require(student != address(0), "StudentSkillNFT: Invalid student address");

        uint256 tokenId = nextTokenId++;
        _owners[tokenId] = student;
        _balances[student] += 1;
        _studentBadges[student].push(tokenId);

        badges[tokenId] = SkillBadge({
            tokenId: tokenId,
            skillName: skillName,
            category: category,
            evidenceURI: evidenceURI,
            student: student,
            teacher: teacher,
            validator: validator,
            issuedDate: block.timestamp,
            grade: grade
        });

        emit Transfer(address(0), student, tokenId);
        emit SkillBadgeMinted(tokenId, student, validator, skillName, category);

        return tokenId;
    }

    /**
     * @dev Bloquea transferencias: las habilidades son Soulbound (pertenecen exclusivamente al alumno).
     */
    function transferFrom(address, address, uint256) external pure {
        revert("StudentSkillNFT: Soulbound token - Transfers are disabled");
    }

    function safeTransferFrom(address, address, uint256) external pure {
        revert("StudentSkillNFT: Soulbound token - Transfers are disabled");
    }

    function safeTransferFrom(address, address, uint256, bytes calldata) external pure {
        revert("StudentSkillNFT: Soulbound token - Transfers are disabled");
    }

    function approve(address, uint256) external pure {
        revert("StudentSkillNFT: Soulbound token - Approvals are disabled");
    }

    function setApprovalForAll(address, bool) external pure {
        revert("StudentSkillNFT: Soulbound token - Approvals are disabled");
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x80ac58cd // ERC-721
            || interfaceId == 0x01ffc9a7; // ERC-165
    }
}
