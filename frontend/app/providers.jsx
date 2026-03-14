"use client";

// We no longer use Reown AppKit / wagmi here.
// The TRON flow is handled directly in `page.jsx` via @tronweb3/walletconnect-tron.

export function Providers({ children }) {
  return children;
}

// Kept for compatibility; not used anymore.
export function getTronChainId() {
  return null;
}
