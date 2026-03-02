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
  npkComposition: z.string().describe('The NPK (Nitrogen, Phosphorus, Potassium) ratio (e.g., "20:20:0"). If non-agricultural, set as "Not Applicable".'),
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
  barcode: z.string().describe('The barcode number of the product.'),
});

export async function getFertilizerProductInfo(input: { barcode: string }): Promise<FertilizerProductInfo> {
  return fertilizerProductInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fertilizerProductInfoPrompt',
  input: {schema: FertilizerInputSchema},
  output: {schema: FertilizerProductInfoSchema},
  prompt: `You are an expert product identification specialist. A user has scanned a barcode: '{{barcode}}'. 

  Your task is to identify the REAL-WORLD product that exactly matches this barcode number. 
  - If the product is an agricultural fertilizer: Provide technical NPK ratios, suitable crops, and field application steps.
  - If the product is a general consumer good (e.g., food, beverage, electronics): Map its attributes to the requested schema. For example, use 'dosage' for serving size and 'application method' for consumption/usage steps.

  You MUST provide accurate, real-world data. If the specific product is niche, generate a highly plausible expert profile based on common products with similar barcode ranges.

  Structure the 5-Step Usage Guide strictly:
  Step 1: Recommended dosage / Serving size
  Step 2: Mixing / Preparation
  Step 3: Application / Consumption Method
  Step 4: Best time to use / Storage
  Step 5: Safety measures

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
