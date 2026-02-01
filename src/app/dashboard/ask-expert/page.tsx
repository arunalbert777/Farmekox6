import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, UserSquare } from 'lucide-react';

const experts = [
  {
    name: "Dr. Anjali Sharma",
    specialty: "Agronomist",
    description: "Specializes in crop rotation, soil health, and sustainable farming practices. 15+ years of experience.",
    image: PlaceHolderImages.find(img => img.id === 'expert1'),
  },
  {
    name: "Mr. Vikram Singh",
    specialty: "Soil Scientist",
    description: "Expert in soil testing, nutrient management, and improving soil fertility for higher yields.",
    image: PlaceHolderImages.find(img => img.id === 'expert2'),
  },
  {
    name: "Dr. Priya Patel",
    specialty: "Pest Control Expert",
    description: "Focuses on Integrated Pest Management (IPM) and organic solutions for common crop diseases.",
    image: PlaceHolderImages.find(img => img.id === 'expert3'),
  },
];

export default function AskExpertPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8">
        <div className='text-center'>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <UserSquare className="size-8 text-primary" />
            </div>
            <h1 className="font-headline text-3xl mt-4">Ask an Expert</h1>
            <p className="text-muted-foreground">Connect with our agricultural experts for personalized advice.</p>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experts.map((expert) => (
          <Card key={expert.name} className="flex flex-col">
            <CardHeader className="items-center">
              {expert.image && (
                <Image
                  src={expert.image.imageUrl}
                  alt={`Portrait of ${expert.name}`}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-primary/20"
                  data-ai-hint={expert.image.imageHint}
                />
              )}
              <CardTitle className="pt-4">{expert.name}</CardTitle>
              <CardDescription className="text-primary font-semibold">{expert.specialty}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-center text-muted-foreground">{expert.description}</p>
            </CardContent>
            <CardFooter className="flex justify-center gap-2">
              <Button>
                <Phone className="mr-2 size-4" /> Call
              </Button>
              <Button variant="secondary">
                <MessageSquare className="mr-2 size-4" /> Message
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
