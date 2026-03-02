'use server';
/**
 * @fileOverview A Genkit flow for providing detailed real-time product information based on global barcode standards.
 * Supports EAN-13, UPC, GTIN, and ISBN.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerProductInfoSchema = z.object({
  productName: z.string().describe('The official commercial name of the product identified by the barcode.'),
  brandName: z.string().describe('The brand or manufacturer name.'),
  npkComposition: z.string().describe('The NPK ratio (e.g., "20:20:0"). For non-agricultural products, use "N/A".'),
  suitableCrops: z.array(z.string()).describe('Specific crops or general use-cases for this product.'),
  recommendedSoilType: z.string().describe('The ideal environment or soil type for this product.'),
  manufacturerDetails: z.string().describe('Information about the manufacturer/brand owner.'),
  expiryDate: z.string().describe('Expiry info or shelf life details.'),
  safetyPrecautions: z.string().describe('Critical safety and handling measures.'),
  usageInstructions: z.object({
    dosagePerAcre: z.string().describe('Step 1: Recommended dosage or portion size.'),
    mixingInstructions: z.string().describe('Step 2: Mixing or preparation steps.'),
    applicationMethod: z.string().describe('Step 3: How to apply or use the product.'),
    bestTimeToApply: z.string().describe('Step 4: Optimal timing for usage or storage.'),
    safetyMeasures: z.string().describe('Step 5: Specific safety measures during use.')
  })
});

export type FertilizerProductInfo = z.infer<typeof FertilizerProductInfoSchema>;

const BarcodeInputSchema = z.object({
  barcode: z.string().describe('The barcode number (EAN, UPC, GTIN, or ISBN).'),
});

export async function getFertilizerProductInfo(input: { barcode: string }): Promise<FertilizerProductInfo> {
  return fertilizerProductInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fertilizerProductInfoPrompt',
  input: {schema: BarcodeInputSchema},
  output: {schema: FertilizerProductInfoSchema},
  prompt: `You are a world-class product database expert. Your task is to identify the EXACT product for the following barcode: '{{barcode}}'.

  CRITICAL IDENTIFICATION RULES:
  1. This barcode could be EAN-13, UPC-A, GTIN, or ISBN.
  2. Perform a strict GS1 Company Prefix lookup to identify the manufacturer.
  3. IDENTIFICATION DATABASE (Prioritize these exact matches):
     - 8901138...: Himalaya Wellness Company (e.g., 8901138815943 is Himalaya Purifying Neem Face Wash/Shampoo).
     - 8901248...: Emami Limited (e.g., 8901248104036 is Navaratna Oil).
     - 8901030...: Hindustan Unilever (HUL).
     - 8901058...: Nestle India.
     - 8901495...: ITC Limited (Yippee, Sunfeast).
     - 8901023...: Dabur India.
  4. DO NOT hallucinate. If you see '8901138', it is HIMALAYA. If you see '8901248', it is EMAMI.
  5. If the product is non-agricultural (like Shampoo or Oil), map its benefits and usage instructions to the schema, using "N/A" for NPK.

  Instructions:
  - Step 1: Provide dosage (for agriculture) or serving/usage amount (for consumer goods).
  - Step 2: Provide mixing (for agriculture) or storage/prep (for consumer goods).
  - Step 3: Provide application/use method.
  - Step 4: Provide best time to use/apply.
  - Step 5: Provide safety precautions during use.

  Always return the exact product profile based on global market knowledge.`,
});

const fertilizerProductInfoFlow = ai.defineFlow(
  {
    name: 'fertilizerProductInfoFlow',
    inputSchema: BarcodeInputSchema,
    outputSchema: FertilizerProductInfoSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Failed to identify product.');
    return output;
  }
);
