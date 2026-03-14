# Deploy to Vercel

## 1. Deploy from the `frontend` folder (so API routes are included)

From the repo root:

```bash
cd frontend
npm install
npx vercel --prod
```

Or in Vercel Dashboard: set **Root Directory** to `frontend`, then deploy from the repo.

## 2. Environment variables (Vercel Dashboard → Settings → Environment Variables)

Add these for **Production** (and Preview if you want):

| Variable | Description |
|----------|-------------|
| `NETWORK` | `mainnet` or `shasta` |
| `FULL_NODE` | TRON full node URL (e.g. `https://api.trongrid.io` or Shasta) |
| `SOLIDITY_NODE` | Same as FULL_NODE if one URL for all |
| `EVENT_SERVER` | Same as FULL_NODE if one URL for all |
| `TREASURY_ADDRESS` | TRON address where TRX/USDT are sent |
| `BACKEND_PRIVATE_KEY` | Private key of the delegated signer (keep secret) |
| `WALLETCONNECT_PROJECT_ID` | From https://cloud.walletconnect.com |
| `USDT_CONTRACT_MAINNET` | Optional; default mainnet USDT |
| `USDT_CONTRACT_SHASTA` | Optional; default Shasta USDT |
| `ACTIVE_PERMISSION_NAME` | Optional; default `GAME_BACKEND` |
| `ACTIVE_PERMISSION_OPERATIONS` | Optional; default operations bitmask |
| `TRONGRID_API_KEY` | Optional; TronGrid API key (reduces 429 rate limits) |
| `NEXT_PUBLIC_AGENT_ZONE_ENABLED` | Optional; set to `true` to enable Agent Zone button in header |

Copy values from your local `.env` (do not commit `.env`).

## 3. After deploy

- Site: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/health` (and `/api/permission/*`, `/api/deduct/*`)
