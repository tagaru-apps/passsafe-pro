import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

import { isProEntitlementActive } from "@/lib/revenuecat-policy";

export type ProPackage = { identifier: string; title: string; description: string; price: string };
export type PurchaseOutcome = { isPro: boolean; cancelled: boolean; message?: string };

let configured = false;

function getApiKey(): string {
  if (Platform.OS === "ios") return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? "";
  if (Platform.OS === "android") return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? "";
  return "";
}

export async function configureRevenueCat() {
  if (configured) return true;
  const apiKey = getApiKey();
  if (!apiKey) return false;
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
  Purchases.configure({ apiKey });
  configured = true;
  return true;
}

export async function getRevenueCatSnapshot(): Promise<{ configured: boolean; isPro: boolean; packages: ProPackage[] }> {
  const ready = await configureRevenueCat();
  if (!ready) return { configured: false, isPro: false, packages: [] };
  const [customerInfo, offerings] = await Promise.all([Purchases.getCustomerInfo(), Purchases.getOfferings()]);
  return {
    configured: true,
    isPro: isProEntitlementActive(customerInfo.entitlements.active),
    packages: (offerings.current?.availablePackages ?? []).map((item) => ({
      identifier: item.identifier,
      title: item.product.title,
      description: item.product.description,
      price: item.product.priceString,
    })),
  };
}

export async function purchaseProPackage(identifier: string): Promise<PurchaseOutcome> {
  const ready = await configureRevenueCat();
  if (!ready) return { isPro: false, cancelled: false, message: "Subscriptions are not configured for this build." };
  const offerings = await Purchases.getOfferings();
  const purchasePackage = offerings.current?.availablePackages.find((item) => item.identifier === identifier);
  if (!purchasePackage) return { isPro: false, cancelled: false, message: "This subscription option is no longer available." };
  try {
    const { customerInfo } = await Purchases.purchasePackage(purchasePackage);
    return { isPro: isProEntitlementActive(customerInfo.entitlements.active), cancelled: false };
  } catch (error) {
    const purchaseError = error as { userCancelled?: boolean; message?: string };
    return { isPro: false, cancelled: Boolean(purchaseError.userCancelled), message: purchaseError.message ?? "The purchase could not be completed." };
  }
}

export async function restoreRevenueCatPurchases(): Promise<PurchaseOutcome> {
  const ready = await configureRevenueCat();
  if (!ready) return { isPro: false, cancelled: false, message: "Subscriptions are not configured for this build." };
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { isPro: isProEntitlementActive(customerInfo.entitlements.active), cancelled: false };
  } catch (error) {
    const restoreError = error as { message?: string };
    return { isPro: false, cancelled: false, message: restoreError.message ?? "Your purchases could not be restored." };
  }
}
