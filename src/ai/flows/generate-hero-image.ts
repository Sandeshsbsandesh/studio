
'use server';
/**
 * @fileOverview A flow for generating a hero image based on a prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const generateHeroImageFlow = ai.defineFlow(
  {
    name: 'generateHeroImageFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media.url) {
        throw new Error('Image generation failed');
    }

    return media.url;
  }
);

export async function generateHeroImage(prompt: string): Promise<string> {
  return await generateHeroImageFlow(prompt);
}
