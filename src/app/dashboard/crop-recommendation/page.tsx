import { CropRecommendationForm } from "@/components/dashboard/crop-recommendation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";

export default function CropRecommendationPage() {
  return (
    <div className="container mx-auto max-w-3xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Leaf className="size-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Crop Recommendation</CardTitle>
          <CardDescription>
            Get intelligent crop recommendations based on season, location, and climatic conditions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CropRecommendationForm />
        </CardContent>
      </Card>
    </div>
  );
}
