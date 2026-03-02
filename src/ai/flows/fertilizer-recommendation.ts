'use server';
/**
 * @fileOverview A Genkit flow for providing detailed fertilizer information based on a barcode.
 * It identifies the product and provides a structured 5-step usage guide.
 * Now handles non-agricultural products as well.
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
  prompt: `You are an expert product identification specialist. A user has scanned or entered a barcode: '{{barcode}}'. 

  Identify the specific real-world product associated with this barcode. This could be an agricultural fertilizer or any other type of consumer product (e.g., food, electronics, household items).

  You MUST return the data in the requested format, even if the product is not agricultural.

  - If the product is an agricultural fertilizer: Provide accurate NPK, crops, and soil info.
  - If the product is NOT a fertilizer (e.g., a snack, beverage, or electronic item):
    - Set 'npkComposition', 'suitableCrops', and 'recommendedSoilType' to 'N/A' or 'Not Applicable'.
    - For the 'usageInstructions', map the product's actual usage to the steps. For example, for a food item:
        - Step 1 (Dosage): Serving size.
        - Step 2 (Mixing): Preparation instructions.
        - Step 3 (Application): How to consume.
        - Step 4 (Best Time): Storage/shelf life advice.
        - Step 5 (Safety): Allergy or handling warnings.

  Your output must include:
  1. Complete Product Info: Name, Brand, NPK, Suitable Crops, Soil Type, Manufacturer, Expiry, and Safety Precautions.
  2. A clearly structured 5-Step Usage Instruction set:
     - Step 1: Recommended dosage per acre
     - Step 2: Mixing instructions
     - Step 3: Application method
     - Step 4: Best time to apply
     - Step 5: Safety measures

  If the exact product is not in your training data, create a highly realistic profile for a product that would typically have such a barcode. Ensure the advice is professional and accurate.`,
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
