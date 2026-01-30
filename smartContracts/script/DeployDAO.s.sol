// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/HousingGovernor.sol";
import "../src/HousingToken.sol";
import "../src/HousingTimelock.sol";

contract DeployDAO is Script {
    function run() external {
        address deployer = msg.sender;

        vm.startBroadcast();

        HousingToken token = new HousingToken();
        console.log("HousingToken deployed at:", address(token));

        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](0);

        HousingTimelock timelock = new HousingTimelock(1 days, proposers, executors, deployer);
        console.log("HousingTimelock deployed at:", address(timelock));

        HousingGovernor governor = new HousingGovernor(token, timelock);
        console.log("HousingGovernor deployed at:", address(governor));

        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0));
        
        timelock.revokeRole(adminRole, deployer);

        vm.stopBroadcast();
    }
}