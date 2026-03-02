'use server';
/**
 * @fileOverview A Genkit flow for providing detailed real-time product information.
 * Supports Indian agricultural QR codes, HSN codes (e.g., 31053000), EAN, UPC, GTIN, and ISBN.
 * Optimized for strict identification of Indian brands (Himalaya, Emami, IFFCO, Syngenta).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerProductInfoSchema = z.object({
  productName: z.string().describe('The official commercial name of the product identified.'),
  brandName: z.string().describe('The brand or manufacturer name (e.g., IFFCO, Himalaya, Bayer).'),
  npkComposition: z.string().describe('The NPK ratio (e.g., "20:20:0"). For non-agricultural products, use "N/A".'),
  suitableCrops: z.array(z.string()).describe('Specific crops or general use-cases for this product.'),
  recommendedSoilType: z.string().describe('The ideal environment or soil type for this product.'),
  manufacturerDetails: z.string().describe('Information about the manufacturer, specifically looking for Indian batch/origin data.'),
  expiryDate: z.string().describe('Expiry info or shelf life details from batch data.'),
  safetyPrecautions: z.string().describe('Critical safety and handling measures, including agrochemical warnings.'),
  usageInstructions: z.object({
    dosagePerAcre: z.string().describe('Step 1: Recommended dosage (e.g., 500ml per acre for Nano Urea).'),
    mixingInstructions: z.string().describe('Step 2: Mixing or preparation steps (e.g., dilute in 200L water).'),
    applicationMethod: z.string().describe('Step 3: How to apply (e.g., Foliar spray, Drip irrigation).'),
    bestTimeToApply: z.string().describe('Step 4: Optimal timing (e.g., 30-35 days after sowing).'),
    safetyMeasures: z.string().describe('Step 5: Specific safety measures during use (e.g., wear gloves, mask).')
  })
});

export type FertilizerProductInfo = z.infer<typeof FertilizerProductInfoSchema>;

const BarcodeInputSchema = z.object({
  barcode: z.string().describe('The barcode number, HSN code, or QR code content string.'),
});

export async function getFertilizerProductInfo(input: { barcode: string }): Promise<FertilizerProductInfo> {
  return fertilizerProductInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fertilizerProductInfoPrompt',
  input: {schema: BarcodeInputSchema},
  output: {schema: FertilizerProductInfoSchema},
  prompt: `You are a specialized Indian agricultural and consumer product database expert. Your task is to identify the EXACT product for the provided input: '{{barcode}}'.

  STRICT IDENTIFICATION PROTOCOLS (MANDATORY):

  1. GS1 INDIA BRAND PREFIX MAPPING:
     - 8901138... -> THIS IS EXCLUSIVELY HIMALAYA WELLNESS COMPANY. (e.g., 8901138815943 is Himalaya Purifying Neem Face Wash).
     - 8901248... -> THIS IS EXCLUSIVELY EMAMI LIMITED / NAVARATNA. (e.g., 8901248104036 is Navaratna Oil).
     - 8901030... -> HINDUSTAN UNILEVER (HUL).
     - 8901058... -> NESTLE INDIA.
     - 8901495... -> ITC LIMITED.
     - 8901023... -> DABUR INDIA.

  2. CRITICAL ERROR PREVENTION:
     - DO NOT confuse prefixes. If it starts with 8901138, it is ALWAYS Himalaya.
     - DO NOT confuse prefixes. If it starts with 8901248, it is ALWAYS Emami/Navaratna.
     - NEVER return "Sunfeast" or "KitKat" for Himalaya or Emami barcodes.
  
  3. AGRICULTURAL DEEP LOOKUP:
     - IFFCO Nano Urea: Often identified by unique alphanumeric QR codes.
     - IFFCO Bharat DAP: HSN 31053000.
     - Syngenta/Bayer: 890 prefix + secondary QR code verification.

  Instructions for Output:
  - For NON-AGRICULTURAL products (Face Wash, Oil, Food):
    * NPK: "N/A"
    * Step 1: Dosage/Serving size (e.g., "Use a coin-sized amount").
    * Step 2: Preparation (e.g., "Wet face before use").
    * Step 3: Method (e.g., "Massage gently in circular motions").
    * Step 4: Best time to use (e.g., "Twice daily, morning and night").
    * Step 5: Safety (e.g., "Avoid contact with eyes").

  - For AGRICULTURAL products:
    * Follow the standard 5-step expert guide for farmers.

  Analyze the barcode '{{barcode}}' carefully and provide the exact real-world product details.`,
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