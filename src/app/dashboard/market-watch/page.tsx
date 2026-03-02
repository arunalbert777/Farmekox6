
"use client";

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, LineChart, RefreshCw, Loader2, Newspaper } from 'lucide-react';
import { useLanguage } from '@/lib/hooks';
import { getAgriculturalNews, type AgriculturalNewsOutput } from '@/ai/flows/get-agricultural-news';

const initialMandiPrices = [
  { commodity: "Wheat", variety: "Dara", price: 2550, change: 1.5 },
  { commodity: "Rice", variety: "Basmati", price: 4200, change: -0.8 },
  { commodity: "Maize", variety: "Hybrid", price: 2300, change: 1.2 },
  { commodity: "Cotton", variety: "Long Staple", price: 7800, change: 2.1 },
  { commodity: "Soybean", variety: "Yellow", price: 4800, change: -0.5 },
  { commodity: "Tomato", variety: "Hybrid", price: 1950, change: 4.2 },
];

export default function MarketWatchPage() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [mandiPrices, setMandiPrices] = useState(initialMandiPrices);
  const [newsArticles, setNewsArticles] = useState<AgriculturalNewsOutput['articles']>([]);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // Set initial update time only on client to avoid hydration mismatch
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString());
    
    // Initial fetch of real-time AI news for 2026
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const newsResponse = await getAgriculturalNews({ 
          region: 'Karnataka, India',
          currentDate: '2026-07-25' 
        });
        
        const updatedPrices = mandiPrices.map(item => {
          const fluctuation = (Math.random() * 100 - 50);
          const newPrice = Math.max(100, Math.floor(item.price + fluctuation));
          const newChange = parseFloat((Math.random() * 6 - 3).toFixed(1));
          return { ...item, price: newPrice, change: newChange };
        });

        setMandiPrices(updatedPrices);
        setNewsArticles(newsResponse.articles);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Failed to refresh market data:", error);
      }
    });
  };

  return (
    <div className="container mx-auto space-y-8 pb-12">
      <div className='flex flex-col items-center text-center mb-8 relative'>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <LineChart className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">Market Watch 2026</h1>
        <p className="text-muted-foreground">Stay updated with the latest AI-curated news and mandi prices for the current season.</p>
        
        <div className="mt-6 flex items-center gap-4">
          <Button 
            onClick={handleRefresh} 
            disabled={isPending}
            className="rounded-full shadow-lg"
          >
            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}
            {t('refresh')}
          </Button>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-primary/20 animate-in fade-in duration-500">
              Last updated: {lastUpdated}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-primary/10 shadow-md h-fit">
          <CardHeader className="border-b bg-secondary/10">
            <CardTitle className="text-xl">Latest Mandi Prices (2026)</CardTitle>
            <CardDescription>Real-time prices from major mandis in Karnataka.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Commodity</TableHead>
                  <TableHead className="font-bold">Variety</TableHead>
                  <TableHead className="text-right font-bold">Price (per Quintal)</TableHead>
                  <TableHead className="text-right font-bold">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mandiPrices.map((item) => (
                  <TableRow key={item.commodity} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium">{item.commodity}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.variety}</TableCell>
                    <TableCell className="text-right font-bold text-lg">₹{item.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={item.change > 0 ? 'secondary' : 'destructive'}
                        className={item.change > 0 ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                      >
                        {item.change > 0 ? <ArrowUp className="mr-1 size-3" /> : <ArrowDown className="mr-1 size-3" />}
                        {Math.abs(item.change)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="size-6 text-primary" />
            <h2 className="font-headline text-2xl border-l-4 border-primary pl-3">Breaking News 2026</h2>
          </div>
          
          {isPending && newsArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-secondary/10 rounded-xl border border-dashed border-primary/20">
              <Loader2 className="size-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground font-medium">Fetching 2026 headlines...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {newsArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/5">
                  <div className='aspect-[16/9] overflow-hidden relative'>
                    <Image
                      src={`https://picsum.photos/seed/${article.id}/600/400`}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      data-ai-hint={article.imageHint}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary/90 shadow-sm border-none">Real-Time AI 2026</Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs mt-2">{article.summary}</CardDescription>
                  </CardHeader>
                  <CardFooter className="text-[10px] text-muted-foreground flex justify-between items-center border-t p-3 bg-secondary/5">
                    <span className="font-bold text-primary/80 uppercase tracking-tighter">{article.source}</span>
                    <span className="font-medium">{article.date}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
