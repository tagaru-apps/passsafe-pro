import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import { resolveAdUnit } from "@/lib/ad-config";

export function AdBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <View style={styles.wrap}><BannerAd unitId={resolveAdUnit("banner", __DEV__)} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{ requestNonPersonalizedAdsOnly: true }} /></View>;
}

const styles = StyleSheet.create({
  wrap: { minHeight: 50, alignItems: "center", justifyContent: "center", overflow: "hidden" },
});
