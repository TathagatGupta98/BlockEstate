// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "../lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "../lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {Nonces} from "../lib/openzeppelin-contracts/contracts/utils/Nonces.sol";

contract HousingToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    // Custom error to save gas
    error SoulboundTransferNotAllowed();

    constructor(address initialOwner) 
        ERC20("ResiSoul", "SBT") 
        ERC20Permit("ResiSoul")
        Ownable(initialOwner) 
    {
        _mint(msg.sender, 1 * 10 ** decimals());
    }

    // New Function: Admin issues a voting pass to a new resident
    function safeMint(address to) public onlyOwner {
        _mint(to, 1 * 10 ** decimals()); // Give exactly 1 voting token
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        if (from != address(0) && to != address(0)) {
            revert SoulboundTransferNotAllowed();
        }

        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}