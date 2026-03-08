import { createThirdwebClient, defineChain } from "thirdweb";
import { CHAIN_ID, TENDERLY_RPC_URL } from "./constants";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
    throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
    clientId: clientId,
});

export const tenderlyChain = defineChain({
    id: CHAIN_ID,
    rpc: TENDERLY_RPC_URL,
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
});
