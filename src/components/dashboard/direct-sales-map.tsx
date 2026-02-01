"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useState } from "react";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { useLanguage } from "@/lib/hooks";
import { ShoppingCart } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: string;
  farmer: string;
  position: { lat: number; lng: number };
  image: ImagePlaceholder | undefined;
};

const products: Product[] = [
  { id: 1, name: "Fresh Tomatoes", price: "₹30/kg", farmer: "Ramesh Kumar", position: { lat: 12.9716, lng: 77.5946 }, image: PlaceHolderImages.find(img => img.id === 'product-tomatoes') },
  { id: 2, name: "Organic Potatoes", price: "₹40/kg", farmer: "Sita Devi", position: { lat: 12.9750, lng: 77.6000 }, image: PlaceHolderImages.find(img => img.id === 'product-potatoes') },
  { id: 3, name: "Red Onions", price: "₹25/kg", farmer: "Vijay Singh", position: { lat: 12.9800, lng: 77.5850 }, image: PlaceHolderImages.find(img => img.id === 'product-onions') },
  { id: 4, name: "Local Spinach", price: "₹20/bunch", farmer: "Anitha", position: { lat: 12.9650, lng: 77.5890 }, image: undefined },
];

export function DirectSalesMap({ apiKey }: { apiKey: string }) {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const position = { lat: 12.9716, lng: 77.5946 }; // Bengaluru

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={position}
        defaultZoom={13}
        mapId="farmekox_direct_sales_map"
        className="w-full h-full"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {products.map((product) => (
          <AdvancedMarker
            key={product.id}
            position={product.position}
            onClick={() => setSelectedProduct(product)}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white bg-primary text-primary-foreground flex items-center justify-center cursor-pointer"
              title={`${product.name} - ${product.price}`}
            >
                <ShoppingCart className="size-4"/>
            </div>
          </AdvancedMarker>
        ))}
      </Map>
      <Sheet open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <SheetContent>
            {selectedProduct && (
                <>
                <SheetHeader>
                    {selectedProduct.image && (
                         <div className="relative aspect-video -mx-6 -mt-6">
                            <Image
                                src={selectedProduct.image.imageUrl}
                                alt={selectedProduct.image.description}
                                fill
                                className="object-cover"
                                data-ai-hint={selectedProduct.image.imageHint}
                            />
                        </div>
                    )}
                    <div className="p-6 pb-0">
                        <SheetTitle className="text-2xl">{selectedProduct.name}</SheetTitle>
                        <SheetDescription>
                            Sold by: {selectedProduct.farmer}
                        </SheetDescription>
                    </div>
                </SheetHeader>
                <div className="py-4 px-6">
                    <p className="text-3xl font-bold text-primary">{selectedProduct.price}</p>
                </div>
                 <SheetFooter className="p-6 pt-0">
                    <Button className="w-full">
                        <ShoppingCart className="mr-2 size-4" /> {t('buy_now')}
                    </Button>
                </SheetFooter>
                </>
            )}
        </SheetContent>
      </Sheet>
    </APIProvider>
  );
}
