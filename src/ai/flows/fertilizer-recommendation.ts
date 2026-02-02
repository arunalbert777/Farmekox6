'use server';
/**
 * @fileOverview A Genkit flow for providing detailed fertilizer information, dosage, and usage instructions based on a barcode.
 *
 * - `getFertilizerRecommendation` - A function that retrieves fertilizer details.
 * - `FertilizerRecommendationInput` - The input type for the `getFertilizerRecommendation` function.
 * - `FertilizerRecommendationOutput` - The return type for the `getFertilizerRecommendation` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerRecommendationInputSchema = z.object({
  barcode: z.string().describe('The barcode number of the fertilizer bag.'),
});
export type FertilizerRecommendationInput = z.infer<
  typeof FertilizerRecommendationInputSchema
>;

const FertilizerRecommendationOutputSchema = z.object({
  name: z.string().describe('The name of the fertilizer.'),
  composition: z
    .string()
    .describe('The chemical composition of the fertilizer.'),
  details: z.string().describe('A brief description of the fertilizer.'),
  dosage: z
    .string()
    .describe('The recommended dosage for a common crop.'),
  usageInstructions: z
    .array(z.string())
    .describe('A step-by-step guide on how to use the fertilizer.'),
});
export type FertilizerRecommendationOutput = z.infer<
  typeof FertilizerRecommendationOutputSchema
>;

export async function getFertilizerRecommendation(
  input: FertilizerRecommendationInput
): Promise<FertilizerRecommendationOutput> {
  return fertilizerRecommendationFlow(input);
}

const fertilizerRecommendationPrompt = ai.definePrompt({
  name: 'fertilizerRecommendationPrompt',
  input: {schema: FertilizerRecommendationInputSchema},
  output: {schema: FertilizerRecommendationOutputSchema},
  prompt: `You are an agricultural expert providing information about fertilizers based on a product barcode. A user has provided the barcode: '{{barcode}}'. Your task is to act as if this barcode is for a real fertilizer product and provide detailed, plausible information for it. Even if the barcode is fictional, create a realistic product profile.

Provide the following details:
1.  **name**: A creative and realistic product name.
2.  **composition**: The chemical composition of the fertilizer.
3.  **details**: A brief description of what it is and its primary benefits.
4.  **dosage**: A recommended dosage for a common crop like rice or wheat (e.g., in kg/acre or kg/hectare).
5.  **usageInstructions**: A simple, step-by-step guide for a farmer on how to apply it. This should be an array of strings.

Always provide a complete response. Do not state that the barcode is unknown or fictional. Provide a concise and easy-to-understand response suitable for a farmer.
`,
});

const fertilizerRecommendationFlow = ai.defineFlow(
  {
    name: 'fertilizerRecommendationFlow',
    inputSchema: FertilizerRecommendationInputSchema,
    outputSchema: FertilizerRecommendationOutputSchema,
  },
  async (input) => {
    const {output} = await fertilizerRecommendationPrompt(input);
    
    if (!output) {
      throw new Error('Failed to get fertilizer recommendation from AI.');
    }

    return output;
  }
);
