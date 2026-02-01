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
import wav from 'wav';
import {googleAI} from '@genkit-ai/google-genai';

const AiVoiceChatAdvisoryInputSchema = z.object({
  language: z
    .enum(['en', 'kn'])
    .describe(
      'The language for the advisory (en for English, kn for Kannada).'
    ),
  query: z.string().describe('The farmer’s query or voice input.'),
});
export type AiVoiceChatAdvisoryInput = z.infer<
  typeof AiVoiceChatAdvisoryInputSchema
>;

const AiVoiceChatAdvisoryOutputSchema = z.object({
  advice: z
    .string()
    .describe('The AI-generated farming advice in the specified language.'),
  audio: z
    .string()
    .describe('The AI-generated farming advice as a WAV data URI.'),
});
export type AiVoiceChatAdvisoryOutput = z.infer<
  typeof AiVoiceChatAdvisoryOutputSchema
>;

export async function aiVoiceChatAdvisory(
  input: AiVoiceChatAdvisoryInput
): Promise<AiVoiceChatAdvisoryOutput> {
  return aiVoiceChatAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiVoiceChatAdvisoryPrompt',
  input: {schema: AiVoiceChatAdvisoryInputSchema},
  output: {
    schema: z.object({
      advice: AiVoiceChatAdvisoryOutputSchema.shape.advice,
    }),
  },
  prompt: `You are an AI-based farming advisor. A farmer will ask a question and you will provide helpful advice in the language they specify. The answer should be concise and easy to understand for a farmer.

  Language: {{language}}
  Query: {{query}}

  Answer in {{language}}: `,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const aiVoiceChatAdvisoryFlow = ai.defineFlow(
  {
    name: 'aiVoiceChatAdvisoryFlow',
    inputSchema: AiVoiceChatAdvisoryInputSchema,
    outputSchema: AiVoiceChatAdvisoryOutputSchema,
  },
  async input => {
    // 1. Get text advice
    const {output: textOutput} = await prompt(input);
    if (!textOutput?.advice) {
      throw new Error('Failed to generate text advice.');
    }
    const adviceText = textOutput.advice;

    // 2. Generate audio from text
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: adviceText,
    });

    if (!media) {
      throw new Error('No media returned from TTS model');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const audioWavBase64 = await toWav(audioBuffer);

    return {
      advice: adviceText,
      audio: 'data:audio/wav;base64,' + audioWavBase64,
    };
  }
);
