# Agent Zone Setup Guide

## Enabling Agent Zone

The Agent Zone button in the header is controlled by the `NEXT_PUBLIC_AGENT_ZONE_ENABLED` environment variable.

### Option 1: Root .env file (Recommended)
Add the following to your root `.env` file (outside the `frontend` folder):
```
NEXT_PUBLIC_AGENT_ZONE_ENABLED=true
```

The `next.config.js` will automatically load this variable from the root `.env` file.

### Option 2: Frontend .env.local file
Alternatively, create or update `frontend/.env.local`:
```
NEXT_PUBLIC_AGENT_ZONE_ENABLED=true
```

### Important Notes:
1. **Restart Required**: After adding the environment variable, you must restart your Next.js dev server for it to take effect.
2. **Build Time**: `NEXT_PUBLIC_*` variables are embedded at build time, so they need to be set before running `npm run dev` or `npm run build`.
3. **Debugging**: Check the browser console for "Agent Zone Enabled: true/false" to verify the variable is being read correctly.

### Testing:
- The Agent Zone button should appear in the header when enabled
- You can also test by adding `?agent=true` to the URL (e.g., `http://localhost:3000?agent=true`)

