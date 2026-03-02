
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { useLanguage } from "@/lib/hooks";
import { ShoppingCart, Plus, Pin, X, MapPin } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: string;
  farmer: string;
  emoji: string;
  position: { lat: number; lng: number };
  image: ImagePlaceholder | undefined;
};

const initialProducts: Product[] = [
  { id: 1, name: "Fresh Tomatoes", price: "₹30/kg", farmer: "Ramesh Kumar", emoji: "🍅", position: { lat: 12.9716, lng: 77.5946 }, image: PlaceHolderImages.find(img => img.id === 'product-tomatoes') },
  { id: 2, name: "Organic Potatoes", price: "₹40/kg", farmer: "Sita Devi", emoji: "🥔", position: { lat: 12.9750, lng: 77.6000 }, image: PlaceHolderImages.find(img => img.id === 'product-potatoes') },
  { id: 3, name: "Red Onions", price: "₹25/kg", farmer: "Vijay Singh", emoji: "🧅", position: { lat: 12.9800, lng: 77.5850 }, image: PlaceHolderImages.find(img => img.id === 'product-onions') },
  { id: 4, name: "Local Spinach", price: "₹20/bunch", farmer: "Anitha", emoji: "🥬", position: { lat: 12.9650, lng: 77.5890 }, image: undefined },
];

const getEmojiForProduct = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('tomato')) return '🍅';
    if (n.includes('potato')) return '🥔';
    if (n.includes('onion')) return '🧅';
    if (n.includes('chili') || n.includes('chilli')) return '🌶️';
    if (n.includes('carrot')) return '🥕';
    if (n.includes('spinach') || n.includes('leaf')) return '🥬';
    if (n.includes('corn') || n.includes('maize')) return '🌽';
    if (n.includes('eggplant') || n.includes('brinjal')) return '🍆';
    return '🌾'; // Default crop
}

export function DirectSalesMap({ apiKey }: { apiKey: string }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const position = { lat: 12.9716, lng: 77.5946 }; // Bengaluru
  
  // Selection Mode State
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [tempPosition, setTempPosition] = useState<{lat: number, lng: number} | null>(null);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const handleMapClick = (e: any) => {
      const latLng = e.detail?.latLng || e.latLng;
      if (!isSelectingLocation || !latLng) return;
      
      const clickedPos = { 
        lat: typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat, 
        lng: typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng 
      };
      
      setTempPosition(clickedPos);
      setIsSelectingLocation(false);
      setIsDialogOpen(true);
  }

  const handleAddProduct = () => {
      if (newProductName && newProductPrice && tempPosition) {
          const newProduct: Product = {
              id: Date.now(),
              name: newProductName,
              price: newProductPrice,
              position: tempPosition,
              farmer: "You",
              emoji: getEmojiForProduct(newProductName),
              image: undefined,
          };
          setProducts(prev => [...prev, newProduct]);
          setIsDialogOpen(false);
          setNewProductName('');
          setNewProductPrice('');
          setTempPosition(null);
      }
  };

  const cancelSelection = () => {
      setIsSelectingLocation(false);
      setTempPosition(null);
  }

  return (
    <APIProvider apiKey={apiKey}>
        <div className="w-full h-full relative">
            {isSelectingLocation && (
                <div className="absolute top-4 inset-x-0 z-20 flex justify-center pointer-events-none px-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-2xl border-2 border-primary-foreground/20 flex items-center justify-between pointer-events-auto animate-in slide-in-from-top-4 duration-300 w-full max-w-sm">
                        <div className="flex items-center gap-2">
                            <MapPin className="size-5 animate-bounce" />
                            <span className="text-sm font-bold">Click on the map to place your pin</span>
                        </div>
                        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={cancelSelection}>
                            <X className="size-4" />
                        </Button>
                    </div>
                </div>
            )}

            <Map
                defaultCenter={position}
                defaultZoom={13}
                mapId="farmekox_direct_sales_map"
                className="w-full h-full"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                onClick={handleMapClick}
                clickableIcons={false}
            >
                {products.map((product) => (
                <AdvancedMarker
                    key={product.id}
                    position={product.position}
                    onClick={() => setSelectedProduct(product)}
                >
                    <div
                    className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center cursor-pointer shadow-xl hover:scale-125 transition-transform text-xl"
                    title={`${product.name} - ${product.price}`}
                    >
                        {product.emoji}
                    </div>
                </AdvancedMarker>
                ))}
            </Map>
            
            {!isSelectingLocation && (
                <Button 
                    size="icon" 
                    className="absolute bottom-6 right-6 rounded-full h-16 w-16 shadow-2xl z-10 border-4 border-background"
                    onClick={() => setIsSelectingLocation(true)}
                >
                    <Plus className="size-8" />
                    <span className="sr-only">Add Product</span>
                </Button>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                        <DialogDescription>
                            Tell us what you are selling and its price.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input 
                                id="name" 
                                value={newProductName} 
                                onChange={e => setNewProductName(e.target.value)} 
                                placeholder="e.g., Fresh Carrots" 
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input 
                                id="price" 
                                value={newProductPrice} 
                                onChange={e => setNewProductPrice(e.target.value)} 
                                placeholder="e.g., ₹50/kg" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Selected Location</Label>
                            {tempPosition && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 border rounded-md bg-secondary/50">
                                    <Pin className="size-4 text-primary" />
                                    <span className="font-mono">
                                        {tempPosition.lat.toFixed(6)}, {tempPosition.lng.toFixed(6)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleAddProduct} disabled={!newProductName || !newProductPrice}>
                            Add Product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-4xl">{selectedProduct.emoji}</span>
                                    <div>
                                        <SheetTitle className="text-2xl">{selectedProduct.name}</SheetTitle>
                                        <SheetDescription>
                                            Sold by: {selectedProduct.farmer}
                                        </SheetDescription>
                                    </div>
                                </div>
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
        </div>
    </APIProvider>
  );
}

