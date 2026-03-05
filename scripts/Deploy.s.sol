// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/OmniSentryCore.sol";
import "../contracts/TokenizedTreasury.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address admin = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Core
        OmniSentryCore core = new OmniSentryCore(admin);
        console.log("OmniSentryCore deployed at:", address(core));

        // Deploy Treasury
        TokenizedTreasury treasury = new TokenizedTreasury(
            "OmniSentry RWA Fund",
            "OS-RWA",
            address(core),
            admin
        );
        console.log("TokenizedTreasury deployed at:", address(treasury));

        vm.stopBroadcast();
    }
}
