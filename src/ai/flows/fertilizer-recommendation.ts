'use server';
/**
 * @fileOverview A Genkit flow for providing detailed real-time product information based on a barcode.
 * It identifies real-world products (agricultural or general consumer goods) and provides structured guidance.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerProductInfoSchema = z.object({
  productName: z.string().describe('The official commercial name of the product identified by the barcode.'),
  brandName: z.string().describe('The brand or manufacturer name.'),
  npkComposition: z.string().describe('The NPK (Nitrogen, Phosphorus, Potassium) ratio (e.g., "20:20:0"). If non-agricultural, set as "N/A".'),
  suitableCrops: z.array(z.string()).describe('Crops/Use-cases for which this product is suitable.'),
  recommendedSoilType: z.string().describe('The ideal environment, soil type, or storage conditions.'),
  manufacturerDetails: z.string().describe('Information about the manufacturer company.'),
  expiryDate: z.string().describe('Expiry date information or shelf life duration.'),
  safetyPrecautions: z.string().describe('Critical safety measures for storage and handling.'),
  usageInstructions: z.object({
    dosagePerAcre: z.string().describe('Step 1: Recommended dosage (per acre for fertilizers) or serving size.'),
    mixingInstructions: z.string().describe('Step 2: Mixing or preparation instructions.'),
    applicationMethod: z.string().describe('Step 3: How to apply or consume the product.'),
    bestTimeToApply: z.string().describe('Step 4: Optimal timing for use or storage advice.'),
    safetyMeasures: z.string().describe('Step 5: Specific safety measures during use/application.')
  })
});

export type FertilizerProductInfo = z.infer<typeof FertilizerProductInfoSchema>;

const FertilizerInputSchema = z.object({
  barcode: z.string().describe('The EAN-13 barcode number of the product.'),
});

export async function getFertilizerProductInfo(input: { barcode: string }): Promise<FertilizerProductInfo> {
  return fertilizerProductInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fertilizerProductInfoPrompt',
  input: {schema: FertilizerInputSchema},
  output: {schema: FertilizerProductInfoSchema},
  prompt: `You are a high-precision product identification expert. A user has scanned this EAN-13 barcode: '{{barcode}}'. 

  CRITICAL INSTRUCTION: You must identify the EXACT brand and product. Do not guess based on similar numbers.
  
  Identification Methodology:
  1. Determine the Country of Origin from the first 3 digits (e.g., 890 is India).
  2. Identify the Manufacturer/Brand using the GS1 Company Prefix.
  3. Locate the specific product variant associated with the full EAN-13 sequence.

  Specific Brand Prefix Examples (MUST CHECK):
  - 8901248: Emami Limited (e.g., Navaratna Oil, Fair & Handsome)
  - 8901138: Himalaya Wellness Company (e.g., Shampoo, Face Wash, Neem Purifying Face Wash)
  - 8901030: Hindustan Unilever (HUL)
  - 8901058: Nestle India
  - 8901495: ITC Limited

  DO NOT hallucinate. You must provide the exact product name, variant, and size if available.

  Mapping Instructions:
  - If agricultural: Provide technical NPK ratios and field application steps.
  - If non-agricultural (General Goods like Shampoo, Oil, etc.): Map attributes to the schema. Use "N/A" for NPK ratios.
  
  The 5-Step Usage Guide MUST be context-specific:
  Step 1: Recommended dosage / Serving size
  Step 2: Mixing / Preparation / Storage before use
  Step 3: Application / Consumption Method
  Step 4: Best time to use / Consumption timing / Storage advice
  Step 5: Safety measures and precautions

  Deliver the final expert advice in clear, professional English.`,
});

const fertilizerProductInfoFlow = ai.defineFlow(
  {
    name: 'fertilizerProductInfoFlow',
    inputSchema: FertilizerInputSchema,
    outputSchema: FertilizerProductInfoSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Failed to identify product.');
    return output;
  }
);
