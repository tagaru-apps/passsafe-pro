import { Platform } from "react-native";

import { initializeMobileAds as initializeWebAds, showRewardedQuestionUnlock as showWebRewarded, showSessionInterstitial as showWebInterstitial } from "@/lib/mobile-ads.web";

type NativeAdsModule = typeof import("@/lib/mobile-ads.native");

function getNativeAds(): NativeAdsModule | null {
  if (Platform.OS === "web") return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/lib/mobile-ads.native") as NativeAdsModule;
}

export async function initializeMobileAds() {
  const nativeAds = getNativeAds();
  return nativeAds ? nativeAds.initializeMobileAds() : initializeWebAds();
}

export async function showSessionInterstitial() {
  const nativeAds = getNativeAds();
  return nativeAds ? nativeAds.showSessionInterstitial() : showWebInterstitial();
}

export async function showRewardedQuestionUnlock() {
  const nativeAds = getNativeAds();
  return nativeAds ? nativeAds.showRewardedQuestionUnlock() : showWebRewarded();
}
