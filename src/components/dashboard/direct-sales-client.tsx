"use client";

import { Store, Terminal } from "lucide-react";
import { DirectSalesMap } from "@/components/dashboard/direct-sales-map";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/lib/hooks";

interface DirectSalesClientProps {
    apiKey?: string;
    isProduction: boolean;
}

export function DirectSalesClient({ apiKey, isProduction }: DirectSalesClientProps) {
  const { t } = useLanguage();

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="text-center mb-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Store className="size-8 text-primary" />
          </div>
          <h1 className="font-headline text-3xl mt-4">{t('direct_sales')}</h1>
          <p className="text-muted-foreground">{t('direct_sales_description')}</p>
        </div>
        <div className="flex-1 rounded-lg overflow-hidden border flex items-center justify-center p-4 bg-secondary/20">
          <Alert variant="destructive" className="max-w-md text-left">
            <Terminal className="h-4 w-4" />
            <AlertTitle>API Key Not Configured</AlertTitle>
            <AlertDescription>
              {isProduction ? (
                <>
                  <p>
                    The Google Maps API key is not configured correctly for your live application.
                  </p>
                  <p className="mt-2">
                    Please ensure you have created a secret named <strong>GOOGLE_MAPS_API_KEY_SECRET</strong> in Google Cloud Secret Manager and that your app has been redeployed.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Your Google Maps API key is not set up correctly. Please add it to your <code>.env</code> file.
                  </p>
                  <pre className="mt-2 rounded-md bg-muted p-2 text-sm overflow-x-auto">
                    <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY"</code>
                  </pre>
                  <p className="mt-2">
                    After adding the key, you must restart your development server for the changes to apply.
                  </p>
                </>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="text-center mb-4">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <Store className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">{t('direct_sales')}</h1>
        <p className="text-muted-foreground">{t('direct_sales_description')}</p>
      </div>
      <div className="flex-1 rounded-lg overflow-hidden border">
        <DirectSalesMap apiKey={apiKey} />
      </div>
    </div>
  );
}
