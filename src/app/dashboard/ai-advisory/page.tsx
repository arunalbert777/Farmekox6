import { BotMessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIChatClient } from '@/components/dashboard/ai-chat-client';

export default function AiAdvisoryPage() {
  return (
    <div className="h-full flex flex-col">
      <div className='text-center mb-4'>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <BotMessageSquare className="size-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl mt-4">AI Farming Advisor</h1>
        <p className="text-muted-foreground">Your personal AI assistant for any farming question.</p>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            <AIChatClient />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
