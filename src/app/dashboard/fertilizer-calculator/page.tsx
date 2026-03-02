"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Redirects legacy /dashboard/fertilizer-calculator path to the modern /dashboard/fertilizer-info
 */
export default function FertilizerCalculatorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/fertilizer-info");
  }, [router]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Redirecting to Fertilizer Info...</p>
    </div>
  );
}
