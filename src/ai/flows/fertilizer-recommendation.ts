'use server';
/**
 * @fileOverview A Genkit flow for identifying agricultural products from photos.
 * Uses Gemini Vision to analyze images of fertilizers, seeds, or pesticides.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerProductInfoSchema = z.object({
  productName: z.string().describe('The official commercial name of the product identified.'),
  brandName: z.string().describe('The brand or manufacturer name (e.g., IFFCO, Bayer, Syngenta).'),
  npkComposition: z.string().describe('The NPK ratio (e.g., "20:20:0"). Use "N/A" if not applicable.'),
  suitableCrops: z.array(z.string()).describe('Specific crops or general use-cases for this product.'),
  recommendedSoilType: z.string().describe('The ideal environment or soil type for this product.'),
  manufacturerDetails: z.string().describe('Information about the manufacturer.'),
  expiryDate: z.string().describe('Estimated shelf life or expiry information visible on the pack.'),
  safetyPrecautions: z.string().describe('Critical safety and handling measures.'),
  usageInstructions: z.object({
    dosagePerAcre: z.string().describe('Step 1: Recommended dosage (e.g., 500ml per acre).'),
    mixingInstructions: z.string().describe('Step 2: Mixing or preparation steps (e.g., dilute in 200L water).'),
    applicationMethod: z.string().describe('Step 3: How to apply (e.g., Foliar spray, Drip irrigation).'),
    bestTimeToApply: z.string().describe('Step 4: Optimal timing (e.g., early morning, specific crop stage).'),
    safetyMeasures: z.string().describe('Step 5: Specific safety measures during use (e.g., wear gloves, mask).')
  })
});

export type FertilizerProductInfo = z.infer<typeof FertilizerProductInfoSchema>;

const PhotoInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of an agricultural product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

export async function getFertilizerProductInfo(input: { photoDataUri: string }): Promise<FertilizerProductInfo> {
  return fertilizerProductInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fertilizerProductInfoPrompt',
  input: {schema: PhotoInputSchema},
  output: {schema: FertilizerProductInfoSchema},
  prompt: `You are an expert agricultural product specialist. Analyze the provided image and identify the agricultural product.

  1. IDENTIFICATION:
     - Look for the brand name (e.g., IFFCO, Coromandel, Bayer).
     - Identify the product type (e.g., Urea, DAP, NPK complex, organic manure).
     - Extract the NPK ratio if visible.

  2. EXPERT ADVICE:
     - Provide accurate manufacturer details.
     - Formulate a strict 5-step usage guide based on standard agricultural practices for this specific product.
     - Include safety warnings for agrochemicals.

  Image to analyze: {{media url=photoDataUri}}

  If the product is not an agricultural input (e.g., it's a food item), still provide its details but note that it's a consumer product.`,
});

const fertilizerProductInfoFlow = ai.defineFlow(
  {
    name: 'fertilizerProductInfoFlow',
    inputSchema: PhotoInputSchema,
    outputSchema: FertilizerProductInfoSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Failed to identify product from image.');
    return output;
  }
);
