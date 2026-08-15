export const DEFAULT_RECOVERY_OFFERING_ID = "passsafe_recovery_offer";

export function getRecoveryOfferingId() {
  return process.env.EXPO_PUBLIC_REVENUECAT_RECOVERY_OFFERING_ID?.trim() || DEFAULT_RECOVERY_OFFERING_ID;
}

export function selectRecoveryPackages<T>(standardPackages: T[], promotionalPackages: T[], recoveryOfferActive: boolean) {
  return recoveryOfferActive && promotionalPackages.length > 0 ? promotionalPackages : standardPackages;
}
