// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/openzeppelin-contracts/contracts/governance/TimelockController.sol";

contract HousingTimelock is TimelockController {
    // minDelay: Minimum time (in seconds) to wait before execution
    // proposers: List of addresses that can propose (usually just the Governor)
    // executors: List of addresses that can execute (usually address(0) for anyone)
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}