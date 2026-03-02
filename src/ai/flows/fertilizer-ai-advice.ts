'use server';
/**
 * @fileOverview A Genkit flow for providing personalized AI guidance for fertilizer usage.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerAIAdviceInputSchema = z.object({
  productName: z.string(),
  npkComposition: z.string(),
  cropType: z.string().describe('The type of crop the farmer is growing.'),
  soilType: z.string().describe('The type of soil in the farm.'),
  farmSizeAcres: z.number().describe('The size of the farm in acres.'),
  language: z.enum(['en', 'kn']).describe('The language for advice.'),
});

const FertilizerAIAdviceOutputSchema = z.object({
  personalizedAdvice: z.string().describe('Detailed AI guidance in the specified language.'),
});

export type FertilizerAIAdviceInput = z.infer<typeof FertilizerAIAdviceInputSchema>;
export type FertilizerAIAdviceOutput = z.infer<typeof FertilizerAIAdviceOutputSchema>;

export async function getPersonalizedFertilizerAdvice(input: FertilizerAIAdviceInput): Promise<FertilizerAIAdviceOutput> {
  return fertilizerAIAdviceFlow(input);
}

const advicePrompt = ai.definePrompt({
  name: 'fertilizerAIAdvicePrompt',
  input: {schema: FertilizerAIAdviceInputSchema},
  output: {schema: FertilizerAIAdviceOutputSchema},
  prompt: `You are an expert agricultural advisor. Provide personalized fertilizer application guidance.

  Fertilizer: {{productName}} (NPK: {{npkComposition}})
  Crop: {{cropType}}
  Soil: {{soilType}}
  Farm Size: {{farmSizeAcres}} Acres
  Language: {{language}}

  Analyze the fertilizer composition for the specific crop and soil type. 
  Suggest an optimized dosage for the total {{farmSizeAcres}} acres.
  Provide best timing for application (e.g., basal dose, top dressing).
  Deliver the expert advice strictly in {{language}}.`,
});

const fertilizerAIAdviceFlow = ai.defineFlow(
  {
    name: 'fertilizerAIAdviceFlow',
    inputSchema: FertilizerAIAdviceInputSchema,
    outputSchema: FertilizerAIAdviceOutputSchema,
  },
  async (input) => {
    const {output} = await advicePrompt(input);
    if (!output) throw new Error('Failed to generate AI advice.');
    return output;
  }
);
