"use client";

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, LineChart, RefreshCw, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/hooks';

const initialMandiPrices = [
  { commodity: "Wheat", variety: "Dara", price: 2350, change: 2.5 },
  { commodity: "Rice", variety: "Basmati", price: 3800, change: -1.2 },
  { commodity: "Maize", variety: "Hybrid", price: 2100, change: 0.5 },
  { commodity: "Cotton", variety: "Long Staple", price: 7500, change: 1.8 },
  { commodity: "Soybean", variety: "Yellow", price: 4500, change: -0.8 },
  { commodity: "Tomato", variety: "Hybrid", price: 1800, change: 5.0 },
];

const initialNewsArticles = [
  {
    id: 1,
    title: "Government Announces New Subsidy for Drip Irrigation Systems",
    source: "AgriNews India",
    date: "July 24, 2024",
    image: PlaceHolderImages.find(img => img.id === 'news1'),
  },
  {
    id: 2,
    title: "Monsoon Forecast Predicts Above-Average Rainfall in Northern States",
    source: "Weather Today",
    date: "July 23, 2024",
    image: PlaceHolderImages.find(img => img.id === 'news2'),
  },
];

export default function MarketWatchPage() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [mandiPrices, setMandiPrices] = useState(initialMandiPrices);
  const [newsArticles, setNewsArticles] = useState(initialNewsArticles);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const handleRefresh = () => {
    startTransition(() => {
      // Simulate real-time price updates with random fluctuations
      const updatedPrices = mandiPrices.map(item => {
        const fluctuation = (Math.random() * 100 - 50); // +/- 50
        const newPrice = Math.max(100, Math.floor(item.price + fluctuation));
        const newChange = parseFloat((Math.random() * 6 - 3).toFixed(1)); // +/- 3%
        return { ...item, price: newPrice, change: newChange };
      });

      // Simulate getting the "latest this month" news
      const currentMonthNews = [
        ...initialNewsArticles,
        {
          id: Date.now(),
          title: "New Export Policy for Onions to Benefit Karnataka Farmers",
          source: "Market Insight",
          date: "July 25, 2024",
          image: PlaceHolderImages.find(img => img.id === 'hero-farm'),
        }
      ].slice(-2);

      setMandiPrices(updatedPrices);
      setNewsArticles(currentMonthNews);
      setLastUpdated(new Date().toLocaleTimeString());
    });
  };

  return (
    <div className="container mx-auto space-y-8 pb-12">
      <div className='flex flex-col items-center text-center mb-8 relative'>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <LineChart className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">Market Watch</h1>
        <p className="text-muted-foreground">Stay updated with the latest news and mandi prices.</p>
        
        <div className="mt-6 flex items-center gap-4">
          <Button 
            onClick={handleRefresh} 
            disabled={isPending}
            className="rounded-full shadow-lg"
          >
            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}
            {t('refresh')}
          </Button>
          <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            Last updated: {lastUpdated}
          </span>
        </div>
      </div>

      <Card className="border-primary/10 shadow-md">
        <CardHeader className="border-b bg-secondary/10">
          <CardTitle className="text-xl">Latest Mandi Prices</CardTitle>
          <CardDescription>Prices from major mandis in Karnataka as of today.</CardDescription>
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

      <div>
        <h2 className="font-headline text-2xl mb-4 border-l-4 border-primary pl-4">Latest News This Month</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {newsArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/5">
                {article.image && (
                    <div className='aspect-video overflow-hidden relative'>
                        <Image
                            src={article.image.imageUrl}
                            alt={article.image.description}
                            width={600}
                            height={400}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            data-ai-hint={article.image.imageHint}
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary/90">Latest</Badge>
                        </div>
                    </div>
                )}
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors leading-snug">{article.title}</CardTitle>
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground flex justify-between items-center border-t pt-4 bg-secondary/5">
                <span className="font-semibold text-primary/80">{article.source}</span>
                <span>{article.date}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
