import { useCallback, useEffect, useState } from "react";

import type { ProPackage } from "@/lib/revenuecat";
import { getRevenueCatSnapshot, purchaseProPackage, restoreRevenueCatPurchases } from "@/lib/revenuecat";
import { usePassSafe } from "@/lib/passsafe-context";

export function useEntitlement() {
  const { usage, setPro } = usePassSafe();
  const [packages, setPackages] = useState<ProPackage[]>([]);
  const [promoPackages, setPromoPackages] = useState<ProPackage[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await getRevenueCatSnapshot();
      setIsConfigured(snapshot.configured);
      setPackages(snapshot.packages);
      setPromoPackages(snapshot.promoPackages);
      await setPro(snapshot.isPro);
      if (!snapshot.configured) setError("Purchases are available in a native iOS or Android development build.");
      else if (!snapshot.isPro && snapshot.packages.length === 0) setError("No Pro packages are available yet. Finish configuring the current offering in RevenueCat.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not load subscription options.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [setPro]);

  useEffect(() => { refresh(); }, [refresh]);

  const purchase = useCallback(async (identifier: string) => {
    setIsWorking(true);
    setError(null);
    const result = await purchaseProPackage(identifier);
    if (result.isPro) await setPro(true);
    else if (!result.cancelled) setError(result.message ?? "The purchase did not activate Pro.");
    setIsWorking(false);
    return result.isPro;
  }, [setPro]);

  const restore = useCallback(async () => {
    setIsWorking(true);
    setError(null);
    const result = await restoreRevenueCatPurchases();
    await setPro(result.isPro);
    if (!result.isPro && !result.cancelled) setError(result.message ?? "No Pro purchase was found for this account.");
    setIsWorking(false);
    return result.isPro;
  }, [setPro]);

  return { isPro: usage.isPro, packages, promoPackages, isConfigured, isLoading, isWorking, error, purchase, restore, refresh };
}
