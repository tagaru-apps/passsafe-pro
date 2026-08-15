export const APP_CONTENT_MAX_WIDTH = 520;

export function getPageHorizontalPadding(width: number): number {
  if (width < 340) return 16;
  if (width >= APP_CONTENT_MAX_WIDTH) return 28;
  return 20;
}

export function isCompactDevice(width: number, height: number): boolean {
  return width < 360 || height < 680;
}

export function getTopContentInset(systemTopInset: number): number {
  return Math.max(systemTopInset, 18);
}
