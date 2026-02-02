import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, UserSquare } from 'lucide-react';

const experts = [
  {
    name: "Dr. Rajesh Kumar",
    specialty: "Urban Farming Specialist, Bengaluru",
    description: "Expert in rooftop gardening, hydroponics, and vertical farming suited for Bengaluru's urban environment. Provides consultations on setting up city farms.",
  },
  {
    name: "Mrs. Sunita Gowda",
    specialty: "Organic Farming Consultant, Bengaluru",
    description: "Specializes in organic certification, soil enrichment with local composts, and pest control using native plants. Based near Lalbagh.",
  },
  {
    name: "Mr. Anand Desai",
    specialty: "Horticulturist, Bengaluru",
    description: "Advises on fruit and vegetable cultivation for commercial and home gardens in the Bengaluru climate. Expert in local varieties and water conservation.",
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
            <CardHeader className="items-center text-center">
              <CardTitle>{expert.name}</CardTitle>
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
