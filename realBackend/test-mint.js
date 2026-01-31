import { ethers } from "ethers";
import "dotenv/config"; 

async function testBlockchainConnection() {
    console.log("--- STARTING CONNECTION TEST ---");

    const RPC = process.env.SEPOLIA_RPC_URL;
    const KEY = process.env.ADMIN_PRIVATE_KEY;
    const ADDR = process.env.HOUSING_TOKEN_ADDRESS;

    console.log("1. Checking Config:");
    console.log("   RPC URL:", RPC ? "✅ Found" : "❌ MISSING");
    console.log("   Private Key:", KEY ? "✅ Found" : "❌ MISSING");
    console.log("   Contract Addr:", ADDR ? `✅ Found (${ADDR})` : "❌ MISSING");

    if (!RPC || !KEY || !ADDR) return;

    try {
        const provider = new ethers.JsonRpcProvider(RPC);
        const wallet = new ethers.Wallet(KEY, provider);

        console.log("\n2. Wallet Info:");
        console.log(`   Address: ${wallet.address}`);
        const balance = await provider.getBalance(wallet.address);
        console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);

        // --- NEW: OWNER CHECK ---
        console.log("\n3. Verifying Contract Ownership...");
        const abi = [
            "function safeMint(address to) public",
            "function owner() public view returns (address)" // Added owner function
        ];
        const contract = new ethers.Contract(ADDR, abi, wallet);

        // Fetch the actual owner from the blockchain
        const onChainOwner = await contract.owner();
        console.log(`   Contract Owner: ${onChainOwner}`);

        // Compare case-insensitive
        if (onChainOwner.toLowerCase() !== wallet.address.toLowerCase()) {
            console.error("\n❌ CRITICAL MISMATCH:");
            console.error("   The wallet in your .env is NOT the owner of this contract.");
            console.error("   You cannot mint tokens. Please find the private key for: " + onChainOwner);
            return; // Stop execution
        } else {
            console.log("   ✅ Success: Your wallet IS the owner.");
        }

        // --- MINTING ---
        console.log("\n4. Attempting to Mint...");
        const testTarget = "0x511b1E175C9DB48bB65b561ff6ad67D85d0cb21f"; 
        
        console.log(`   Minting to: ${testTarget}`);
        const tx = await contract.safeMint(testTarget);
        console.log(`   🚀 Transaction Sent! Hash: ${tx.hash}`);
        
        console.log("\n   Waiting for confirmation...");
        await tx.wait();
        console.log("   ✅ Transaction Confirmed!");

    } catch (error) {
        console.error("\n❌ FAILED:");
        // Check for common error codes
        if (error.code === 'CALL_EXCEPTION') {
            console.error("   Contract rejected the transaction. Reasons:");
            console.error("   1. You are not the owner (checked above).");
            console.error("   2. The user already has a token (Soulbound restriction).");
            console.error("   3. Contract is paused.");
        } else {
            console.error(error);
        }
    }
}

testBlockchainConnection();