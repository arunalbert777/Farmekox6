'use server';
/**
 * @fileOverview A Genkit flow for providing detailed fertilizer information based on a barcode.
 *
 * - `getFertilizerProductInfo` - A function that retrieves fertilizer details.
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
  safetyPrecautions: z.string().describe('Important safety measures for handling.'),
  usageInstructions: z.object({
    dosagePerAcre: z.string().describe('Recommended dosage per acre.'),
    mixingInstructions: z.string().describe('Instructions on how to mix.'),
    applicationMethod: z.string().describe('Method: spray, soil, or drip.'),
    bestTimeToApply: z.string().describe('Optimal time/stage for application.'),
    safetyMeasures: z.string().describe('Specific safety steps during application.')
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
  output: {schema: FertilizerProductInfoInfoSchema},
  prompt: `You are an agricultural expert. A user has provided a fertilizer barcode: '{{barcode}}'. 
  Identify the product associated with this barcode. If you cannot find the specific real-world product, create a highly realistic and plausible profile for a fertilizer that would likely have such a barcode.

  Provide:
  - productName
  - brandName
  - npkComposition (e.g. 19:19:19, 20:20:0)
  - suitableCrops (array)
  - recommendedSoilType
  - manufacturerDetails
  - expiryDate (plausible format)
  - safetyPrecautions
  - usageInstructions (dosagePerAcre, mixingInstructions, applicationMethod, bestTimeToApply, safetyMeasures)

  Ensure the details are accurate for the NPK composition you assign.`,
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
