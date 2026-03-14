# Tron Delegated Spending Demo (Active Permission + Silent Backend Transactions)

**Language / tech stack:** **JavaScript** (Node.js backend). **Frontend:** Next.js 14 (React) in `frontend/` **or** vanilla JS in `public/` (esbuild). Backend: ES modules in `src/` (Express, TronWeb).

This project demonstrates the **exact UX** you described:

- User connects Tron wallet (e.g., TronLink)
- User signs **one on-chain** `AccountPermissionUpdate` transaction to delegate an **Active permission** to your backend signer key
- After that, your backend can send **silent** on-chain transactions **from the user's account** to your treasury:
  - TRX transfers
  - USDT (TRC20) transfers (via contract call to `transfer(address,uint256)`)

> ⚠️ Important: TRON Active permissions restrict **transaction types** via `operations`, but they do not restrict *destination addresses* or *specific contract methods*.
> If you allow TRX transfers and contract triggers, your delegated signer can perform those tx types broadly.

## What’s included

- **Backend:** `src/` – Node.js (Express) API server
- **Frontend:** Next.js `frontend/` (TronLink + WalletConnect) or vanilla `public/`. Both: connect wallet, one-time permission, register, silent TRX/USDT deductions

## Network switching (Mainnet/Testnet)

The backend is configured via `.env`:
- `NETWORK=mainnet` or `NETWORK=shasta` (you can add `nile` similarly)
- Node endpoints (`FULL_NODE`, `SOLIDITY_NODE`, `EVENT_SERVER`)
- USDT contract address for that network
- Treasury address
- Backend signer private key

Switching networks is as simple as changing `.env` and restarting.

## Prerequisites

- Node.js 18+
- A TronLink wallet installed in the browser
- TRX on the chosen network (for fees/bandwidth/energy)
- USDT on the chosen network (optional; only if you test USDT transfers)

## Quick start

**1. Backend (required)** – from repo root:

```bash
cp .env.example .env
# Edit .env (network, keys, WALLETCONNECT_PROJECT_ID for WalletConnect)
npm install
npm run dev
```

Backend runs at **http://localhost:8787**.

**2a. Next.js frontend (recommended)**

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**. The app proxies `/api/*` to the backend (set `API_URL` or `NEXT_PUBLIC_API_URL` in `frontend/.env.local` if the backend is not at `http://localhost:8787`).

**2b. Vanilla frontend**

From repo root: `npm run build` (bundles `public/src/app.mjs` → `public/app.js`). Then open **http://localhost:8787** (backend serves `public/`).

## One-time delegation flow (what happens)

1. Frontend builds an `AccountPermissionUpdate` tx using TronWeb in the browser (through TronLink provider).
2. User confirms it in TronLink (this is the **only wallet popup**).
3. Backend fetches the account permissions and finds the `ACTIVE` permission named `GAME_BACKEND`.
4. Backend stores `permissionId` for that user.
5. Backend can now sign and broadcast TRX transfers / USDT transfers on behalf of that user, using `permission_id`.

## About the `operations` field

The default `operations` value used here matches a commonly referenced “all operations except `AccountPermissionUpdateContract`” example:

`7fff1fc0037e0000000000000000000000000000000000000000000000000000`

This is useful because it prevents the delegated active permission from changing permissions again.
See TRON’s multi-signature docs and examples for details.

## Files

- `src/config.js` – network config + env parsing
- `src/tron.js` – TronWeb instance + tx helpers
- `src/store.js` – in-memory store (swap for DB/Redis)
- `src/routes.js` – API endpoints
- `frontend/` – Next.js (React) app; `frontend/app/page.js` – main UI
- `public/` – vanilla HTML/JS UI (optional)

## Production hardening checklist (not implemented in demo)

- Replace in-memory store with DB/Redis
- Add auth (session/JWT) binding user account to requests
- Rate limiting, anti-replay, audit logs
- Multi-sig threshold >1 for backend signing
- Fraud rules (per-tx caps, daily limits, allowlists)
- Monitoring of delegated accounts and outgoing tx

---

**License:** MIT
