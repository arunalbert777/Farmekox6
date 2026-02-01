'use server';

/**
 * @fileOverview A flow that provides rain alerts and irrigation advice to farmers.
 *
 * - rainAlertIrrigationAdvice - A function that handles the rain alert and irrigation advice process.
 * - RainAlertIrrigationAdviceInput - The input type for the rainAlertIrrigationAdvice function.
 * - RainAlertIrrigationAdviceOutput - The return type for the rainAlertIrrigationAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherForecastSchema = z.object({
  chanceOfRain: z.number().describe('The chance of rain in percentage (0-100).'),
  date: z.string().describe('The date for the weather forecast (YYYY-MM-DD).'),
});

const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe('The location for which to retrieve the weather forecast.'),
});

const WeatherForecastOutputSchema = z.array(WeatherForecastSchema);

const getWeatherForecast = ai.defineTool(
  {
    name: 'getWeatherForecast',
    description: 'Retrieves the 7-day weather forecast for a given location.',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: WeatherForecastOutputSchema,
  },
  async input => {
    // TODO: Implement the weather forecast retrieval logic here using an external API.
    // For now, return some dummy data.
    return [
      {date: '2024-07-22', chanceOfRain: 10},
      {date: '2024-07-23', chanceOfRain: 20},
      {date: '2024-07-24', chanceOfRain: 60},
      {date: '2024-07-25', chanceOfRain: 70},
      {date: '2024-07-26', chanceOfRain: 10},
      {date: '2024-07-27', chanceOfRain: 5},
      {date: '2024-07-28', chanceOfRain: 5},
    ];
  }
);

const RainAlertIrrigationAdviceInputSchema = z.object({
  location: z.string().describe('The location for the weather forecast.'),
  cropType: z.string().describe('The type of crop being grown.'),
});
export type RainAlertIrrigationAdviceInput = z.infer<typeof RainAlertIrrigationAdviceInputSchema>;

const RainAlertIrrigationAdviceOutputSchema = z.object({
  advice: z
    .string()
    .describe(
      'Advice on whether to skip irrigation based on the weather forecast and crop type.'
    ),
});
export type RainAlertIrrigationAdviceOutput = z.infer<typeof RainAlertIrrigationAdviceOutputSchema>;

export async function rainAlertIrrigationAdvice(
  input: RainAlertIrrigationAdviceInput
): Promise<RainAlertIrrigationAdviceOutput> {
  return rainAlertIrrigationAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rainAlertIrrigationAdvicePrompt',
  input: {schema: RainAlertIrrigationAdviceInputSchema},
  output: {schema: RainAlertIrrigationAdviceOutputSchema},
  tools: [getWeatherForecast],
  prompt: `You are an expert agricultural advisor. Based on the weather forecast for {{{location}}} and the crop type {{{cropType}}}, advise the farmer on whether to skip irrigation.

  Consider the following weather forecast:
  {{#each (getWeatherForecast location=location)}}
  - Date: {{date}}, Chance of Rain: {{chanceOfRain}}%
  {{/each}}
  
  Give a short, concise answer.
  `,
});

const rainAlertIrrigationAdviceFlow = ai.defineFlow(
  {
    name: 'rainAlertIrrigationAdviceFlow',
    inputSchema: RainAlertIrrigationAdviceInputSchema,
    outputSchema: RainAlertIrrigationAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
