export const ADMIN_PASSWORD = 'ASSGA202';
export const LEGACY_ADMIN_PASSWORDS = new Set(['ASSGA202', 'ASSGA2026']);

export function normalizeAdminPassword(value: string | undefined): string {
  return String(value ?? '').trim();
}

export function isValidAdminPassword(value: string | undefined): boolean {
  const normalized = normalizeAdminPassword(value);
  return normalized.length > 0 && LEGACY_ADMIN_PASSWORDS.has(normalized);
}
