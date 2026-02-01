'use server';
/**
 * @fileOverview An AI-based voice and chat advisory flow for farmers, supporting Kannada and English.
 *
 * - aiVoiceChatAdvisory - A function that handles the voice and chat advisory process.
 * - AiVoiceChatAdvisoryInput - The input type for the aiVoiceChatAdvisory function.
 * - AiVoiceChatAdvisoryOutput - The return type for the aiVoiceChatAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiVoiceChatAdvisoryInputSchema = z.object({
  language: z.enum(['en', 'kn']).describe('The language for the advisory (en for English, kn for Kannada).'),
  query: z.string().describe('The farmer\u2019s query or voice input.'),
});
export type AiVoiceChatAdvisoryInput = z.infer<typeof AiVoiceChatAdvisoryInputSchema>;

const AiVoiceChatAdvisoryOutputSchema = z.object({
  advice: z.string().describe('The AI-generated farming advice in the specified language.'),
});
export type AiVoiceChatAdvisoryOutput = z.infer<typeof AiVoiceChatAdvisoryOutputSchema>;

export async function aiVoiceChatAdvisory(input: AiVoiceChatAdvisoryInput): Promise<AiVoiceChatAdvisoryOutput> {
  return aiVoiceChatAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiVoiceChatAdvisoryPrompt',
  input: {schema: AiVoiceChatAdvisoryInputSchema},
  output: {schema: AiVoiceChatAdvisoryOutputSchema},
  prompt: `You are an AI-based farming advisor. A farmer will ask a question and you will provide helpful advice in the language they specify.

  Language: {{language}}
  Query: {{query}}

  Answer: `,
});

const aiVoiceChatAdvisoryFlow = ai.defineFlow(
  {
    name: 'aiVoiceChatAdvisoryFlow',
    inputSchema: AiVoiceChatAdvisoryInputSchema,
    outputSchema: AiVoiceChatAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
