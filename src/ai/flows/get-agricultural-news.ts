'use server';
/**
 * @fileOverview A Genkit flow for fetching/generating real-time agricultural news for India.
 *
 * - getAgriculturalNews - A function that returns the latest news articles.
 * - AgriculturalNewsInput - Input schema for the news flow.
 * - AgriculturalNewsOutput - Output schema containing a list of news articles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgriculturalNewsInputSchema = z.object({
  region: z.string().default('India').describe('The region to fetch news for.'),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format.'),
});
export type AgriculturalNewsInput = z.infer<typeof AgriculturalNewsInputSchema>;

const NewsArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  source: z.string(),
  date: z.string(),
  imageHint: z.string().describe('A keyword for searching a relevant image on Unsplash (e.g., "tractor", "crops").'),
});

const AgriculturalNewsOutputSchema = z.object({
  articles: z.array(NewsArticleSchema),
});
export type AgriculturalNewsOutput = z.infer<typeof AgriculturalNewsOutputSchema>;

export async function getAgriculturalNews(input: AgriculturalNewsInput): Promise<AgriculturalNewsOutput> {
  return getAgriculturalNewsFlow(input);
}

const newsPrompt = ai.definePrompt({
  name: 'getAgriculturalNewsPrompt',
  input: {schema: AgriculturalNewsInputSchema},
  output: {schema: AgriculturalNewsOutputSchema},
  prompt: `You are an agricultural news aggregator. Today's date is July 25, 2026.
  Generate 3 highly realistic, "breaking" agricultural news articles relevant to farmers in {{region}} for late July 2026.
  
  Focus on:
  - 2026 Government subsidies or policy changes (e.g., PM-KISAN 2026 Monsoon Installment).
  - Weather patterns (Monsoon 2026 impact on South India).
  - 2026 Market trends or commodity exports (e.g., Sunflower oil price stability).
  - New 2026 farming technologies (e.g., Nano-fertilizer distribution centers).

  Ensure the dates in the articles are very recent (e.g., July 23, 2026).
  Provide a relevant 'imageHint' for each (e.g., "farm", "wheat", "irrigation").`,
});

const getAgriculturalNewsFlow = ai.defineFlow(
  {
    name: 'getAgriculturalNewsFlow',
    inputSchema: AgriculturalNewsInputSchema,
    outputSchema: AgriculturalNewsOutputSchema,
  },
  async input => {
    const {output} = await newsPrompt(input);
    if (!output) throw new Error('Failed to generate agricultural news.');
    return output;
  }
);