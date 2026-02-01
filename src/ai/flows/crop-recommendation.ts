// src/ai/flows/crop-recommendation.ts
'use server';

/**
 * @fileOverview A Genkit flow for providing intelligent, location-specific crop recommendations based on season and climate.
 *
 * - `getCropRecommendation` - A function that retrieves crop recommendations based on the provided input.
 * - `CropRecommendationInput` - The input type for the `getCropRecommendation` function.
 * - `CropRecommendationOutput` - The return type for the `getCropRecommendation` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationInputSchema = z.object({
  location: z
    .string()
    .describe("The geographical location for which crop recommendations are needed."),
  season: z.string().describe("The current season (e.g., 'Spring', 'Summer', 'Autumn', 'Winter')."),
  climaticConditions: z
    .string()
    .describe("A description of the current climatic conditions, including temperature, rainfall, and humidity."),
});
export type CropRecommendationInput = z.infer<typeof CropRecommendationInputSchema>;

const CropRecommendationOutputSchema = z.object({
  recommendedCrops: z
    .array(z.string())
    .describe("A list of recommended crops for the given location, season, and climatic conditions."),
  reasoning: z
    .string()
    .describe("The reasoning behind the crop recommendations, explaining why these crops are suitable."),
});
export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

export async function getCropRecommendation(
  input: CropRecommendationInput
): Promise<CropRecommendationOutput> {
  return cropRecommendationFlow(input);
}

const cropRecommendationPrompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided location, season, and climatic conditions, recommend suitable crops for the farmer to plant.

Location: {{{location}}}
Season: {{{season}}}
Climatic Conditions: {{{climaticConditions}}}

Consider factors such as temperature, rainfall, humidity, and soil type to provide the best recommendations.  Also consider market demand to make crops which will result in high revenue for the farmer.

Format your output as a list of recommended crops along with a detailed explanation of your reasoning.
`, // Added market demand
});

const cropRecommendationFlow = ai.defineFlow(
  {
    name: 'cropRecommendationFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await cropRecommendationPrompt(input);
    return output!;
  }
);
