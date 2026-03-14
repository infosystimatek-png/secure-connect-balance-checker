# Environment Variables Setup Guide

## ✅ Current Flow - All variables read from root `.env` file

### Root `.env` File Location
All environment variables should be in the **root `.env` file** (outside the `frontend` folder):
```
TRON-main/
├── .env                    ← ALL variables here
├── frontend/
│   ├── .env.local         ← NOT USED (can be deleted)
│   └── ...
└── ...
```

### How It Works

1. **Backend (`src/config.js`)**:
   - Uses `dotenv/config` which automatically reads from root `.env`
   - Reads: `NETWORK`, `FULL_NODE`, `TREASURY_ADDRESS`, `BACKEND_PRIVATE_KEY`, etc.

2. **Frontend Server-Side (`frontend/server/config.js`)**:
   - Reads from `process.env` 
   - `next.config.js` loads ALL variables from root `.env` into `process.env`
   - This ensures server-side API routes can access all variables

3. **Frontend Client-Side**:
   - Only `NEXT_PUBLIC_*` variables are accessible
   - These are loaded from root `.env` via `next.config.js`
   - Example: `NEXT_PUBLIC_AGENT_ZONE_ENABLED=true`

### Required Variables in Root `.env`

```env
# Network Configuration
NETWORK=shasta
FULL_NODE=https://api.shasta.trongrid.io
SOLIDITY_NODE=https://api.shasta.trongrid.io
EVENT_SERVER=https://api.shasta.trongrid.io

# Wallet & Treasury
TREASURY_ADDRESS=Your_TRON_Treasury_Address
BACKEND_PRIVATE_KEY=Your_Backend_Private_Key

# WalletConnect
WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional
USDT_CONTRACT_MAINNET=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
USDT_CONTRACT_SHASTA=TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs
ACTIVE_PERMISSION_NAME=GAME_BACKEND
ACTIVE_PERMISSION_OPERATIONS=7fff1fc0037e0000000000000000000000000000000000000000000000000000
TRONGRID_API_KEY=your_api_key_optional

# Frontend Client Variables (must start with NEXT_PUBLIC_)
NEXT_PUBLIC_AGENT_ZONE_ENABLED=true
```

### Verification Steps

1. **Check root `.env` exists**: Make sure `.env` file is in the root directory
2. **Restart servers**: After changing `.env`, restart both:
   - Backend: `npm run dev` (from root)
   - Frontend: `npm run dev` (from frontend folder)
3. **Check console**: Look for `✅ Loaded environment variables from root .env file` in Next.js startup logs
4. **Test API**: Visit `/api/health` to verify backend is reading variables correctly

### Important Notes

- ✅ **DO**: Put all variables in root `.env`
- ❌ **DON'T**: Use `frontend/.env.local` (it's not needed)
- ⚠️ **Security**: Never commit `.env` to git (it's in `.gitignore`)
- 🔄 **Restart**: Always restart servers after changing `.env`

### Troubleshooting

If variables aren't loading:
1. Check `.env` file is in root directory (not in `frontend/`)
2. Verify variable names match exactly (case-sensitive)
3. Restart both backend and frontend servers
4. Check Next.js console for the success message
5. Verify no syntax errors in `.env` (no spaces around `=`)

