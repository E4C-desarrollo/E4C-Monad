// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title E4CToken
 * @notice Token ERC-20 educativo de recompensas para la plataforma E4C desplegado en Monad.
 * Se utiliza para incentivar la adquisición y validación de habilidades estudiantiles.
 */
contract E4CToken {
    string public name = "Edu4Chain Skill Points";
    string public symbol = "E4C";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    mapping(address => bool) public authorizedMinters;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event MinterUpdated(address indexed minter, bool authorized);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "E4CToken: Only owner");
        _;
    }

    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner, "E4CToken: Not authorized to mint");
        _;
    }

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply * 10 ** decimals);
        }
    }

    function setMinter(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
        emit MinterUpdated(minter, authorized);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "E4CToken: Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 currentAllowance = allowance[from][msg.sender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= value, "E4CToken: Insufficient allowance");
            allowance[from][msg.sender] = currentAllowance - value;
        }
        _transfer(from, to, value);
        return true;
    }

    function mintReward(address student, uint256 amount) external onlyMinter {
        _mint(student, amount);
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0), "E4CToken: Transfer to zero address");
        require(balanceOf[from] >= value, "E4CToken: Balance too low");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
    }

    function _mint(address to, uint256 value) internal {
        require(to != address(0), "E4CToken: Mint to zero address");
        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
    }
}
