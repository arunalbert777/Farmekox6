'use server';
/**
 * @fileOverview A Genkit flow for providing detailed fertilizer information based on a barcode.
 * It identifies the product and provides a structured 5-step usage guide.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerProductInfoSchema = z.object({
  productName: z.string().describe('The commercial name of the fertilizer product.'),
  brandName: z.string().describe('The brand name of the fertilizer.'),
  npkComposition: z.string().describe('The NPK (Nitrogen, Phosphorus, Potassium) ratio (e.g., "20:20:0").'),
  suitableCrops: z.array(z.string()).describe('Crops for which this fertilizer is suitable.'),
  recommendedSoilType: z.string().describe('The general soil type(s) recommended.'),
  manufacturerDetails: z.string().describe('Information about the manufacturer.'),
  expiryDate: z.string().describe('Estimated expiry date or shelf life info.'),
  safetyPrecautions: z.string().describe('General safety measures for storage and handling.'),
  usageInstructions: z.object({
    dosagePerAcre: z.string().describe('Step 1: Recommended dosage per acre.'),
    mixingInstructions: z.string().describe('Step 2: Mixing instructions (if required).'),
    applicationMethod: z.string().describe('Step 3: Application method (spray / soil application / drip irrigation).'),
    bestTimeToApply: z.string().describe('Step 4: Best time to apply.'),
    safetyMeasures: z.string().describe('Step 5: Specific safety measures during application.')
  })
});

export type FertilizerProductInfo = z.infer<typeof FertilizerProductInfoSchema>;

const FertilizerInputSchema = z.object({
  barcode: z.string().describe('The barcode number of the fertilizer bag.'),
});

export async function getFertilizerProductInfo(input: { barcode: string }): Promise<FertilizerProductInfo> {
  return fertilizerProductInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fertilizerProductInfoPrompt',
  input: {schema: FertilizerInputSchema},
  output: {schema: FertilizerProductInfoSchema},
  prompt: `You are an expert agricultural consultant. A user has scanned or entered a fertilizer barcode: '{{barcode}}'. 

  Identify the specific real-world product associated with this barcode. If the exact product is not in your training data, create a highly realistic and scientifically accurate profile for a fertilizer that would typically have such a barcode, ensuring all details are consistent with the assigned NPK ratio.

  Your output must include:
  1. Complete Product Info: Name, Brand, NPK, Suitable Crops, Soil Type, Manufacturer, Expiry, and Safety Precautions.
  2. A clearly structured 5-Step Usage Instruction set:
     - Step 1: Recommended dosage per acre
     - Step 2: Mixing instructions
     - Step 3: Application method (specify if spray, soil, or drip)
     - Step 4: Best time to apply
     - Step 5: Safety measures during application

  Ensure the advice is professional, accurate, and helpful for a farmer.`,
});

const fertilizerProductInfoFlow = ai.defineFlow(
  {
    name: 'fertilizerProductInfoFlow',
    inputSchema: FertilizerInputSchema,
    outputSchema: FertilizerProductInfoSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Failed to identify fertilizer.');
    return output;
  }
);
