export const admobTestUnits = {
  banner: "ca-app-pub-3940256099942544/6300978111",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
} as const;

export const admobProductionUnits = {
  banner: process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID ?? "",
  interstitial: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_UNIT_ID ?? "",
  rewarded: process.env.EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID ?? "",
} as const;

export function resolveAdUnit(kind: keyof typeof admobTestUnits, isDevelopment: boolean): string {
  if (isDevelopment || !admobProductionUnits[kind]) return admobTestUnits[kind];
  return admobProductionUnits[kind];
}
