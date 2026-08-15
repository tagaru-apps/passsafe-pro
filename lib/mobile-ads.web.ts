export async function initializeMobileAds() {
  return;
}

export async function showSessionInterstitial() {
  return false;
}

export async function showRewardedQuestionUnlock() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return true;
}

export async function checkRewardedAdAvailability(): Promise<"ready" | "unavailable"> {
  return "ready";
}
