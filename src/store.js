/**
 * In-memory store for address -> permissionId.
 * Replace with DB/Redis in production.
 */
const registry = new Map();

export function register(address, permissionId) {
  const normalized = (address || "").toLowerCase();
  if (!normalized) return;
  registry.set(normalized, Number(permissionId));
}

export function getPermissionId(address) {
  if (!address) return null;
  const normalized = (address || "").toLowerCase();
  const id = registry.get(normalized);
  return id != null ? id : null;
}

export default { register, getPermissionId };
