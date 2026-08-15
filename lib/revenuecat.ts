import { Platform } from "react-native";

import { configureRevenueCat as configureWeb, getRevenueCatSnapshot as getWebSnapshot, purchaseProPackage as purchaseWebPackage, restoreRevenueCatPurchases as restoreWebPurchases } from "@/lib/revenuecat.web";

type NativeRevenueCatModule = typeof import("@/lib/revenuecat.native");

function getNativeRevenueCat(): NativeRevenueCatModule | null {
  if (Platform.OS === "web") return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/lib/revenuecat.native") as NativeRevenueCatModule;
}

export async function configureRevenueCat() { const nativeRevenueCat = getNativeRevenueCat(); return nativeRevenueCat ? nativeRevenueCat.configureRevenueCat() : configureWeb(); }
export async function getRevenueCatSnapshot() { const nativeRevenueCat = getNativeRevenueCat(); return nativeRevenueCat ? nativeRevenueCat.getRevenueCatSnapshot() : getWebSnapshot(); }
export async function purchaseProPackage(identifier: string) { const nativeRevenueCat = getNativeRevenueCat(); return nativeRevenueCat ? nativeRevenueCat.purchaseProPackage(identifier) : purchaseWebPackage(); }
export async function restoreRevenueCatPurchases() { const nativeRevenueCat = getNativeRevenueCat(); return nativeRevenueCat ? nativeRevenueCat.restoreRevenueCatPurchases() : restoreWebPurchases(); }
export type { ProPackage, PurchaseOutcome } from "@/lib/revenuecat.native";
