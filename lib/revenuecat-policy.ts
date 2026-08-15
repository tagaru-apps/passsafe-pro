export const PRO_ENTITLEMENT_ID = "pro";

export function isProEntitlementActive(activeEntitlements: Record<string, unknown> | undefined): boolean {
  return Boolean(activeEntitlements?.[PRO_ENTITLEMENT_ID]);
}
