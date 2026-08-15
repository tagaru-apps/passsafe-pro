import mobileAds, { AdEventType, InterstitialAd, RewardedAd, RewardedAdEventType } from "react-native-google-mobile-ads";

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

export async function showRewardedQuestionUnlock() {
  const rewarded = RewardedAd.createForAdRequest(resolveAdUnit("rewarded", __DEV__), {
    requestNonPersonalizedAdsOnly: true,
  });

  return new Promise<boolean>((resolve) => {
    let earnedReward = false;
    const cleanUp = () => {
      loadUnsubscribe();
      rewardUnsubscribe();
      closeUnsubscribe();
      errorUnsubscribe();
    };
    const finish = (result: boolean) => {
      cleanUp();
      resolve(result);
    };
    const loadUnsubscribe = rewarded.addAdEventListener(AdEventType.LOADED, () => rewarded.show());
    const rewardUnsubscribe = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => { earnedReward = true; });
    const closeUnsubscribe = rewarded.addAdEventListener(AdEventType.CLOSED, () => finish(earnedReward));
    const errorUnsubscribe = rewarded.addAdEventListener(AdEventType.ERROR, () => finish(false));
    rewarded.load();
  });
}
