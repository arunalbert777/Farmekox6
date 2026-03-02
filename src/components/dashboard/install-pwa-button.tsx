'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Tractor, X } from 'lucide-react';
import { useLanguage } from '@/lib/hooks';
import { Card, CardContent } from '@/components/ui/card';

/**
 * A PWA installation prompt component.
 * It listens for the 'beforeinstallprompt' event and displays a banner to the user.
 */
export function InstallPWAButton() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on the client
    if (typeof window === 'undefined') return;

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If the app is already installed, hide the button
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    }

    // Clear the deferred prompt variable, it can only be used once
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-xl shadow-lg border border-primary/20">
            <Tractor className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">Install Farmekox</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">Add to Home Screen for the best experience</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button size="sm" onClick={handleInstallClick} className="shadow-md h-9">
            <Download className="mr-2 size-4" />
            {t('install_app')}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}