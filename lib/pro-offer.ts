export const RECOVERY_OFFER_SECONDS = 15 * 60;

export function getRemainingOfferSeconds(startedAt: string | null, now = Date.now()) {
  if (!startedAt) return 0;
  const elapsed = Math.floor((now - new Date(startedAt).getTime()) / 1000);
  return Math.max(0, RECOVERY_OFFER_SECONDS - elapsed);
}

export function formatOfferCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}
