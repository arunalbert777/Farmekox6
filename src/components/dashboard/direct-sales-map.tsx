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
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { useLanguage } from "@/lib/hooks";
import { ShoppingCart, Plus, Pin, Loader2 } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: string;
  farmer: string;
  position: { lat: number; lng: number };
  image: ImagePlaceholder | undefined;
};

const initialProducts: Product[] = [
  { id: 1, name: "Fresh Tomatoes", price: "₹30/kg", farmer: "Ramesh Kumar", position: { lat: 12.9716, lng: 77.5946 }, image: PlaceHolderImages.find(img => img.id === 'product-tomatoes') },
  { id: 2, name: "Organic Potatoes", price: "₹40/kg", farmer: "Sita Devi", position: { lat: 12.9750, lng: 77.6000 }, image: PlaceHolderImages.find(img => img.id === 'product-potatoes') },
  { id: 3, name: "Red Onions", price: "₹25/kg", farmer: "Vijay Singh", position: { lat: 12.9800, lng: 77.5850 }, image: PlaceHolderImages.find(img => img.id === 'product-onions') },
  { id: 4, name: "Local Spinach", price: "₹20/bunch", farmer: "Anitha", position: { lat: 12.9650, lng: 77.5890 }, image: undefined },
];

export function DirectSalesMap({ apiKey }: { apiKey: string }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const position = { lat: 12.9716, lng: 77.5946 }; // Bengaluru
  
  // State for adding a new product
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductPosition, setNewProductPosition] = useState<{lat: number, lng: number} | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  useEffect(() => {
      // Reset form when dialog is closed
      if (!isDialogOpen) {
          setNewProductName('');
          setNewProductPrice('');
          setNewProductPosition(null);
          setIsSelectingLocation(false);
      }
  }, [isDialogOpen]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
      if (!isSelectingLocation || !e.latLng) return;
      setNewProductPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setIsSelectingLocation(false);
  }

  const handleAddProduct = () => {
      if (newProductName && newProductPrice && newProductPosition) {
          const newProduct: Product = {
              id: Date.now(),
              name: newProductName,
              price: newProductPrice,
              position: newProductPosition,
              farmer: "You", // Placeholder for current user
              image: undefined,
          };
          setProducts(prev => [...prev, newProduct]);
          setIsDialogOpen(false);
      }
  };

  return (
    <APIProvider apiKey={apiKey}>
        <div className="w-full h-full relative">
            <Map
                defaultCenter={position}
                defaultZoom={13}
                mapId="farmekox_direct_sales_map"
                className="w-full h-full"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                onClick={handleMapClick}
                cursor={isSelectingLocation ? 'crosshair' : 'default'}
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
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="icon" className="absolute bottom-4 right-4 rounded-full h-14 w-14 shadow-lg z-10">
                        <Plus className="size-6" />
                        <span className="sr-only">Add Product</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a New Product Pin</DialogTitle>
                        <DialogDescription>
                            Fill in the product details, then place a pin on the map.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" value={newProductName} onChange={e => setNewProductName(e.target.value)} placeholder="e.g., Fresh Carrots" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} placeholder="e.g., ₹50/kg" />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            {newProductPosition ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-md bg-secondary/50">
                                    <Pin className="size-4 text-primary" />
                                    <span>{newProductPosition.lat.toFixed(4)}, {newProductPosition.lng.toFixed(4)}</span>
                                    <Button variant="link" className="p-0 h-auto ml-auto" onClick={() => { setNewProductPosition(null); setIsSelectingLocation(true); }}>Change</Button>
                                </div>
                            ) : (
                                <Button variant="outline" className="w-full" onClick={() => setIsSelectingLocation(true)} disabled={isSelectingLocation}>
                                    {isSelectingLocation ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                            Click on the map to place your pin...
                                        </>
                                    ) : (
                                        'Select Location on Map'
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleAddProduct} disabled={!newProductName || !newProductPrice || !newProductPosition || isSelectingLocation}>Add Product</Button>
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
        </div>
    </APIProvider>
  );
}
