import "dotenv/config";

const network = (process.env.NETWORK || "shasta").toLowerCase();
const fullNode = process.env.FULL_NODE || (network === "mainnet" ? "https://api.trongrid.io" : "https://api.shasta.trongrid.io");
const solidityNode = process.env.SOLIDITY_NODE || fullNode;
const eventServer = process.env.EVENT_SERVER || fullNode;

const usdtMainnet = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const usdtShasta = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs";
const usdtContract = network === "mainnet"
  ? (process.env.USDT_CONTRACT_MAINNET || usdtMainnet)
  : (process.env.USDT_CONTRACT_SHASTA || usdtShasta);

export const config = {
  network,
  fullNode,
  solidityNode,
  eventServer,
  treasuryAddress: process.env.TREASURY_ADDRESS || "",
  backendPrivateKey: process.env.BACKEND_PRIVATE_KEY || "",
  usdtContract,
  activePermissionName: process.env.ACTIVE_PERMISSION_NAME || "GAME_BACKEND",
  activePermissionOperations: process.env.ACTIVE_PERMISSION_OPERATIONS || "7fff1fc0037e0000000000000000000000000000000000000000000000000000",
  port: parseInt(process.env.PORT || "8787", 10),
  walletConnectProjectId: (process.env.WALLETCONNECT_PROJECT_ID || "").trim() || "YOUR_PROJECT_ID_HERE",
};

export default config;
