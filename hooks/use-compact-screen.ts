import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { isCompactDevice } from "@/lib/layout";

export function useCompactScreen() {
  const { width, height } = useWindowDimensions();
  return useMemo(() => ({
    isCompact: isCompactDevice(width, height),
    width,
    height,
  }), [width, height]);
}
