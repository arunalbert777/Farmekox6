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

// Mock database to map barcode to product name
const mockProductDb: {[key: string]: string} = {
  '123456789': 'Urea Gold',
  '987654321': 'DAP (Di-Ammonium Phosphate)',
};

export const FertilizerRecommendationInputSchema = z.object({
  barcode: z.string().describe('The barcode number of the fertilizer bag.'),
});
export type FertilizerRecommendationInput = z.infer<
  typeof FertilizerRecommendationInputSchema
>;

export const FertilizerRecommendationOutputSchema = z.object({
  name: z.string().describe('The name of the fertilizer.'),
  composition: z
    .string()
    .describe('The chemical composition of the fertilizer.'),
  details: z.string().describe('A brief description of the fertilizer.'),
  dosage: z
    .string()
    .describe('The recommended dosage for a common crop like rice or wheat.'),
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
  input: {schema: z.object({productName: z.string()})},
  output: {schema: FertilizerRecommendationOutputSchema},
  prompt: `You are an agricultural expert providing information about fertilizers.
For the fertilizer named "{{productName}}", provide the following details:

1.  **name**: The product name "{{productName}}".
2.  **composition**: The typical chemical composition.
3.  **details**: A brief description of what it is and its primary benefits.
4.  **dosage**: A general recommended dosage for a common crop like rice or wheat (e.g., in kg/acre or kg/hectare).
5.  **usageInstructions**: A simple, step-by-step guide for a farmer on how to apply it. This should be an array of strings.

Provide a concise and easy-to-understand response suitable for a farmer.
`,
});

const fertilizerRecommendationFlow = ai.defineFlow(
  {
    name: 'fertilizerRecommendationFlow',
    inputSchema: FertilizerRecommendationInputSchema,
    outputSchema: FertilizerRecommendationOutputSchema,
  },
  async ({barcode}) => {
    const productName = mockProductDb[barcode];

    if (!productName) {
      throw new Error('Fertilizer not found for this barcode.');
    }

    const {output} = await fertilizerRecommendationPrompt({productName});
    return output!;
  }
);
