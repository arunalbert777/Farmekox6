
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Tractor, X, Sparkles } from 'lucide-react';
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
      console.log('PWA: beforeinstallprompt event fired');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If the app is already installed, hide the button
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
      console.log('PWA: App is already in standalone mode (installed)');
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

  // If not visible, we don't render anything to avoid cluttering the UI
  // Note: Most browsers require HTTPS and certain user interaction before firing the install prompt.
  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-primary bg-primary/10 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 ring-2 ring-primary/20">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl shadow-xl border-2 border-primary-foreground/20 relative">
            <Tractor className="size-8 text-primary-foreground" />
            <Sparkles className="size-3 text-accent absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold leading-tight text-primary">Install Farmekox</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-snug">
              Get the best farming experience. Add to your home screen now!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button size="lg" onClick={handleInstallClick} className="shadow-lg h-11 px-6 font-bold">
            <Download className="mr-2 size-5" />
            {t('install_app')}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <X className="size-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
