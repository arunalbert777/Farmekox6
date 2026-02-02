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
  name: z.string().describe('The name of the fertilizer. If the barcode does not correspond to a real fertilizer, state that it is an "Unknown Product".'),
  composition: z
    .string()
    .describe('The chemical composition of the fertilizer. If unknown, state "N/A".'),
  details: z.string().describe('A brief description of the fertilizer. If unknown, explain that the barcode could not be identified.'),
  dosage: z
    .string()
    .describe('The recommended dosage for a common crop like rice or wheat. If unknown, state "N/A".'),
  usageInstructions: z
    .array(z.string())
    .describe('A step-by-step guide on how to use the fertilizer. If unknown, provide an empty array.'),
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
  prompt: `You are an agricultural expert providing information about fertilizers based on a product barcode.

A user has provided the barcode: '{{barcode}}'.

Based on this barcode, identify the fertilizer product. If it's a known fertilizer barcode, provide the following details:

1.  **name**: The product name.
2.  **composition**: The typical chemical composition.
3.  **details**: A brief description of what it is and its primary benefits.
4.  **dosage**: A general recommended dosage for a common crop like rice or wheat (e.g., in kg/acre or kg/hectare).
5.  **usageInstructions**: A simple, step-by-step guide for a farmer on how to apply it. This should be an array of strings.

If the barcode does not correspond to a known fertilizer product, you MUST return the 'name' as "Unknown Product", 'details' as "The scanned barcode does not correspond to a known fertilizer product.", and other fields as "N/A" or empty arrays as appropriate. Do not make up information for unrecognized barcodes.

For example, a barcode '123456789' might be for 'Urea Gold'. A barcode '987654321' might be for 'DAP'. A barcode like 'abc' is not a real fertilizer.

Provide a concise and easy-to-understand response suitable for a farmer.
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
    
    if (output.name === 'Unknown Product') {
        throw new Error('Fertilizer not found for this barcode.');
    }

    return output;
  }
);
