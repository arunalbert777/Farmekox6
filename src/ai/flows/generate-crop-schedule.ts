'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized agricultural schedule.
 *
 * - generateCropSchedule - A function that returns a list of farming activities.
 * - CropScheduleInput - The input type for the generateCropSchedule function.
 * - CropScheduleOutput - The return type for the generateCropSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropScheduleInputSchema = z.object({
  cropType: z.string().describe('The name of the crop (e.g., Wheat, Rice, Tomato).'),
  sowingDate: z.string().describe('The sowing date in YYYY-MM-DD format.'),
});
export type CropScheduleInput = z.infer<typeof CropScheduleInputSchema>;

const CropEventSchema = z.object({
  date: z.string().describe('The date of the activity (YYYY-MM-DD).'),
  activityType: z.enum(['Fertilization', 'Irrigation', 'Weeding', 'Pesticide', 'Harvesting']),
  description: z.string().describe('A brief explanation of what needs to be done.'),
});

const CropScheduleOutputSchema = z.object({
  events: z.array(CropEventSchema),
});
export type CropScheduleOutput = z.infer<typeof CropScheduleOutputSchema>;

export async function generateCropSchedule(input: CropScheduleInput): Promise<CropScheduleOutput> {
  return generateCropScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCropSchedulePrompt',
  input: {schema: CropScheduleInputSchema},
  output: {schema: CropScheduleOutputSchema},
  prompt: `You are an expert agronomist. Generate a detailed farming schedule for the crop "{{cropType}}" starting from the sowing date "{{sowingDate}}".

  Provide a list of at least 8 key activities including:
  - Multiple "Fertilization" sessions (Basal, Top Dressing).
  - Regular "Irrigation" cycles.
  - "Weeding" sessions.
  - "Pesticide" or "Fungicide" application dates.
  - An estimated "Harvesting" date.

  The dates must be realistic based on the growth cycle of "{{cropType}}". Return the dates in YYYY-MM-DD format.`,
});

const generateCropScheduleFlow = ai.defineFlow(
  {
    name: 'generateCropScheduleFlow',
    inputSchema: CropScheduleInputSchema,
    outputSchema: CropScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Failed to generate crop schedule.');
    return output;
  }
);
