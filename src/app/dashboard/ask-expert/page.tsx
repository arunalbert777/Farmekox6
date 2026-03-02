import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, UserSquare, Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const experts = [
  {
    id: "exp1",
    name: "Dr. Anjali Sharma",
    specialty: "Agronomist & Crop Specialist",
    location: "Jayanagar, Bengaluru",
    rating: 4.8,
    reviews: 124,
    description: "Expert in soil health and high-yield crop management specifically for the Karnataka region. Specializes in Ragi and Maize.",
    phone: "+91 98450 12345",
    image: PlaceHolderImages.find(img => img.id === 'expert1')?.imageUrl
  },
  {
    id: "exp2",
    name: "Mr. Vikram Singh",
    specialty: "Soil Testing & Nutrient Expert",
    location: "Whitefield, Bengaluru",
    rating: 4.5,
    reviews: 89,
    description: "15+ years experience in precise soil analysis and customized fertilizer schedules for organic and commercial farms.",
    phone: "+91 80234 56789",
    image: PlaceHolderImages.find(img => img.id === 'expert2')?.imageUrl
  },
  {
    id: "exp3",
    name: "Dr. Priya Patel",
    specialty: "Pest & Disease Control",
    location: "Malleshwaram, Bengaluru",
    rating: 4.9,
    reviews: 210,
    description: "Leading expert in identifying and treating complex plant diseases using integrated pest management techniques.",
    phone: "+91 99001 88776",
    image: PlaceHolderImages.find(img => img.id === 'expert3')?.imageUrl
  },
  {
    id: "exp4",
    name: "Mr. Suresh Hegde",
    specialty: "Seed Tech & Hybrid Varieties",
    location: "Hebbal, Bengaluru",
    rating: 4.6,
    reviews: 56,
    description: "Advises on choosing the right seeds for local climate conditions. Expert in drought-resistant varieties.",
    phone: "+91 94480 55443",
    image: undefined
  },
  {
    id: "exp5",
    name: "Ms. Kavitha Rao",
    specialty: "Organic Certification Consultant",
    location: "Koramangala, Bengaluru",
    rating: 4.7,
    reviews: 72,
    description: "Helps farmers transition to organic farming and navigate the certification process for export markets.",
    phone: "+91 91234 56780",
    image: undefined
  },
  {
    id: "exp6",
    name: "Dr. Ravi Chandra",
    specialty: "Horticulture & Greenhouse Farming",
    location: "Banashankari, Bengaluru",
    rating: 4.4,
    reviews: 45,
    description: "Specialist in poly-house cultivation, vertical farming, and efficient drip irrigation systems.",
    phone: "+91 88776 55443",
    image: undefined
  },
];

export default function AskExpertPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-8 pb-12">
      <div className='text-center'>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <UserSquare className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4 md:text-4xl">Connect with an Expert</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2 text-lg">
          Get professional guidance from verified agricultural specialists in Bengaluru.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {experts.map((expert) => (
          <Card key={expert.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow border-primary/10">
            <CardHeader className="space-y-1 pb-2">
              <div className="flex justify-between items-start mb-2">
                <Avatar className="size-16 border-2 border-primary/20">
                  {expert.image ? (
                    <AvatarImage src={expert.image} alt={expert.name} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <UserSquare className="size-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Badge variant="secondary" className="bg-secondary text-primary font-bold shadow-sm">
                  <Star className="size-3 mr-1 fill-primary" />
                  {expert.rating}
                </Badge>
              </div>
              <CardTitle className="text-xl pt-2">{expert.name}</CardTitle>
              <CardDescription className="text-primary font-bold uppercase text-xs tracking-wider">
                {expert.specialty}
              </CardDescription>
              <div className="flex items-center text-xs text-muted-foreground pt-1">
                <MapPin className="size-3 mr-1" />
                {expert.location}
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{expert.description}"
              </p>
              <div className="mt-4 flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`size-3 ${i < Math.floor(expert.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground ml-1">
                  ({expert.reviews} reviews)
                </span>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 border-t pt-4 bg-secondary/5">
              <Button className="w-full" asChild>
                <a href={`tel:${expert.phone.replace(/\s/g, '')}`}>
                  <Phone className="mr-2 size-4" /> Call
                </a>
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 size-4" /> Message
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}