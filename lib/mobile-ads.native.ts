import mobileAds, { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";

import { resolveAdUnit } from "@/lib/ad-config";

let initialized = false;

export async function initializeMobileAds() {
  if (initialized) return;
  await mobileAds().initialize();
  initialized = true;
}

export async function showSessionInterstitial() {
  const interstitial = InterstitialAd.createForAdRequest(resolveAdUnit("interstitial", __DEV__), {
    requestNonPersonalizedAdsOnly: true,
  });

  return new Promise<boolean>((resolve) => {
    const loadUnsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show();
    });
    const closeUnsubscribe = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      loadUnsubscribe();
      closeUnsubscribe();
      resolve(true);
    });
    const errorUnsubscribe = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      loadUnsubscribe();
      closeUnsubscribe();
      errorUnsubscribe();
      resolve(false);
    });
    interstitial.load();
  });
}
