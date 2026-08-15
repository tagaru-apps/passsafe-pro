import type { ProPackage, PurchaseOutcome } from "@/lib/revenuecat.native";

const unavailable: PurchaseOutcome = { isPro: false, cancelled: false, message: "Purchases are available in a native iOS or Android development build." };

export async function configureRevenueCat() { return false; }
export async function getRevenueCatSnapshot(): Promise<{ configured: boolean; isPro: boolean; packages: ProPackage[] }> { return { configured: false, isPro: false, packages: [] }; }
export async function purchaseProPackage(): Promise<PurchaseOutcome> { return unavailable; }
export async function restoreRevenueCatPurchases(): Promise<PurchaseOutcome> { return unavailable; }
