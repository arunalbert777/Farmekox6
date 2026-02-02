import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, LineChart } from 'lucide-react';

const mandiPrices = [
  { commodity: "Wheat", variety: "Dara", price: 2350, change: 2.5 },
  { commodity: "Rice", variety: "Basmati", price: 3800, change: -1.2 },
  { commodity: "Maize", variety: "Hybrid", price: 2100, change: 0.5 },
  { commodity: "Cotton", variety: "Long Staple", price: 7500, change: 1.8 },
  { commodity: "Soybean", variety: "Yellow", price: 4500, change: -0.8 },
  { commodity: "Tomato", variety: "Hybrid", price: 1800, change: 5.0 },
];

const newsArticles = [
  {
    id: 1,
    title: "Government Announces New Subsidy for Drip Irrigation Systems",
    source: "AgriNews India",
    date: "July 22, 2024",
    image: PlaceHolderImages.find(img => img.id === 'news1'),
  },
  {
    id: 2,
    title: "Monsoon Forecast Predicts Above-Average Rainfall in Northern States",
    source: "Weather Today",
    date: "July 21, 2024",
    image: PlaceHolderImages.find(img => img.id === 'news2'),
  },
];

export default function MarketWatchPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div className='text-center mb-8'>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <LineChart className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">Market Watch</h1>
        <p className="text-muted-foreground">Stay updated with the latest news and mandi prices.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Mandi Prices</CardTitle>
          <CardDescription>Prices from major mandis as of today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead className="text-right">Price (per Quintal)</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mandiPrices.map((item) => (
                <TableRow key={item.commodity}>
                  <TableCell className="font-medium">{item.commodity}</TableCell>
                  <TableCell>{item.variety}</TableCell>
                  <TableCell className="text-right font-semibold">₹{item.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={item.change > 0 ? 'secondary' : 'destructive'}>
                      {item.change > 0 ? <ArrowUp className="mr-1 size-3" /> : <ArrowDown className="mr-1 size-3" />}
                      {item.change}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-headline text-2xl mb-4">Latest News</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {newsArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
                {article.image && (
                    <div className='aspect-video overflow-hidden'>
                        <Image
                            src={article.image.imageUrl}
                            alt={article.image.description}
                            width={600}
                            height={400}
                            className="object-cover w-full h-full"
                            data-ai-hint={article.image.imageHint}
                        />
                    </div>
                )}
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardFooter className="text-sm text-muted-foreground">
                <span>{article.source} &bull; {article.date}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
