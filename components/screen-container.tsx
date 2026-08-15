import { View, type ViewProps } from "react-native";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets, type Edge } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";
import { getTopContentInset } from "@/lib/layout";

export const APP_CONTENT_MAX_WIDTH = 520;

export interface ScreenContainerProps extends ViewProps {
  /**
   * SafeArea edges to apply. Defaults to ["top", "left", "right"].
   * Bottom is typically handled by Tab Bar.
   */
  edges?: Edge[];
  /**
   * Tailwind className for the content area.
   */
  className?: string;
  /**
   * Additional className for the outer container (background layer).
   */
  containerClassName?: string;
  /**
   * Additional className for the SafeAreaView (content layer).
   */
  safeAreaClassName?: string;
}

/**
 * A container component that properly handles SafeArea and background colors.
 *
 * The outer View extends to full screen (including status bar area) with the background color,
 * while the inner SafeAreaView ensures content is within safe bounds.
 *
 * Usage:
 * ```tsx
 * <ScreenContainer className="p-4">
 *   <Text className="text-2xl font-bold text-foreground">
 *     Welcome
 *   </Text>
 * </ScreenContainer>
 * ```
 */
export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  style,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const includesTopInset = edges.includes("top");
  const safeAreaEdges = edges.filter((edge) => edge !== "top") as Edge[];

  return (
    <View className={cn("flex-1", "bg-background", containerClassName)} style={styles.outer} {...props}>
      <SafeAreaView
        edges={safeAreaEdges}
        className={cn("flex-1", safeAreaClassName)}
        style={[styles.frame, includesTopInset && { paddingTop: getTopContentInset(insets.top) }, style]}
      >
        <View className={cn("flex-1", className)}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
    backgroundColor: Platform.OS === "web" ? "#E5E7EB" : "#FAFAF8",
  },
  frame: {
    width: "100%",
    maxWidth: APP_CONTENT_MAX_WIDTH,
    alignSelf: "center",
    backgroundColor: "#FAFAF8",
    ...(Platform.OS === "web"
      ? {
          shadowColor: "#111827",
          shadowOpacity: 0.14,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: 8 },
        }
      : {}),
  },
});
