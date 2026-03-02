'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/hooks';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * A PWA installation prompt component featuring the official Farmekox logo.
 */
export function InstallPWAButton() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-primary/50 bg-gradient-to-r from-primary/10 to-green-500/10 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 ring-1 ring-primary/20">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative bg-white p-1 rounded-2xl shadow-xl border-2 border-primary/20 size-16 flex-shrink-0">
            {logo && (
              <Image 
                src={logo.imageUrl} 
                alt="Farmekox Logo" 
                fill 
                className="object-contain p-1 rounded-xl"
              />
            )}
            <Sparkles className="size-4 text-accent absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold leading-tight text-primary">Install Farmekox</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-snug">
              Get the official Farmekox experience on your home screen.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button size="lg" onClick={handleInstallClick} className="shadow-lg h-11 px-6 font-bold bg-primary hover:bg-primary/90">
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
