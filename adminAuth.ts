export function normalizeAdminPassword(value: string | undefined): string {
  return String(value ?? '').trim();
}

export function isValidAdminPassword(value: string | undefined): boolean {
  const normalized = normalizeAdminPassword(value);
  const configuredPassword = normalizeAdminPassword(process.env.ADMIN_PASSWORD);
  return configuredPassword.length > 0 && normalized === configuredPassword;
}
