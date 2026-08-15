import { Platform } from "react-native";

import { AdBanner as WebAdBanner } from "@/components/ads/ad-banner.web";

type NativeBannerModule = typeof import("@/components/ads/ad-banner.native");

function getNativeBanner() {
  if (Platform.OS === "web") return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return (require("@/components/ads/ad-banner.native") as NativeBannerModule).AdBanner;
}

export function AdBanner({ visible }: { visible: boolean }) {
  const NativeAdBanner = getNativeBanner();
  return NativeAdBanner ? <NativeAdBanner visible={visible} /> : <WebAdBanner visible={visible} />;
}
