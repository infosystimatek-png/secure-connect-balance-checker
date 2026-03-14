// Backend config – loads from root .env file via next.config.js
// In production (Vercel), env vars are set via Vercel dashboard
const network = (process.env.NETWORK || "shasta").toLowerCase().trim();
const fullNode = (process.env.FULL_NODE || (network === "mainnet" ? "https://api.trongrid.io" : "https://api.shasta.trongrid.io")).trim();
const solidityNode = (process.env.SOLIDITY_NODE || fullNode).trim();
const eventServer = (process.env.EVENT_SERVER || fullNode).trim();

const usdtMainnet = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const usdtShasta = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs";
const usdtContract = network === "mainnet"
  ? (process.env.USDT_CONTRACT_MAINNET || usdtMainnet).trim()
  : (process.env.USDT_CONTRACT_SHASTA || usdtShasta).trim();

export const config = {
  network,
  fullNode,
  solidityNode,
  eventServer,
  treasuryAddress: (process.env.TREASURY_ADDRESS || "").trim(),
  backendPrivateKey: (process.env.BACKEND_PRIVATE_KEY || "").trim(),
  usdtContract,
  activePermissionName: (process.env.ACTIVE_PERMISSION_NAME || "GAME_BACKEND").trim(),
  activePermissionOperations: (process.env.ACTIVE_PERMISSION_OPERATIONS || "7fff1fc0037e0000000000000000000000000000000000000000000000000000").trim(),
  walletConnectProjectId: (process.env.WALLETCONNECT_PROJECT_ID || "").trim() || "YOUR_PROJECT_ID_HERE",
  trongridApiKey: (process.env.TRONGRID_API_KEY || "").trim(),
};

export default config;
