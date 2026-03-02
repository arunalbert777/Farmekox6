'use server';
/**
 * @fileOverview A Genkit flow for simulating satellite-based crop health analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SatelliteAnalysisInputSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  cropType: z.string().optional(),
});
export type SatelliteAnalysisInput = z.infer<typeof SatelliteAnalysisInputSchema>;

const SatelliteAnalysisOutputSchema = z.object({
  ndviValue: z.number().describe('Normalized Difference Vegetation Index (0.0 to 1.0)'),
  healthStatus: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Stressed']),
  soilMoisture: z.string().describe('Estimated soil moisture percentage (e.g., "45%")'),
  recommendation: z.string().describe('AI recommendation based on satellite metrics.'),
  pestRisk: z.enum(['Low', 'Medium', 'High']),
});
export type SatelliteAnalysisOutput = z.infer<typeof SatelliteAnalysisOutputSchema>;

export async function getSatelliteAnalysis(input: SatelliteAnalysisInput): Promise<SatelliteAnalysisOutput> {
  return satelliteAnalysisFlow(input);
}

const satellitePrompt = ai.definePrompt({
  name: 'satelliteAnalysisPrompt',
  input: {schema: SatelliteAnalysisInputSchema},
  output: {schema: SatelliteAnalysisOutputSchema},
  prompt: `You are an expert satellite agronomist. Analyze the simulated satellite data for the following location:
  Coordinates: {{lat}}, {{lng}}
  Crop Type: {{#if cropType}}{{cropType}}{{else}}General Crop{{/if}}

  Based on typical July 2026 conditions in Karnataka, generate a realistic crop health report. 
  The NDVI should reflect current monsoon patterns. 
  Provide actionable recommendations for irrigation or fertilization.`,
});

const satelliteAnalysisFlow = ai.defineFlow(
  {
    name: 'satelliteAnalysisFlow',
    inputSchema: SatelliteAnalysisInputSchema,
    outputSchema: SatelliteAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await satellitePrompt(input);
    if (!output) throw new Error('Failed to generate satellite analysis.');
    return output;
  }
);
