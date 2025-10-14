
'use server';

import {
  suggestAlternativeServiceProvider,
  SuggestAlternativeServiceProviderInput,
  SuggestAlternativeServiceProviderOutput,
} from '@/ai/flows/suggest-alternative-service-provider';
import { z } from 'zod';

const SuggestAlternativeServiceProviderInputSchema = z.object({
  city: z.string().min(1, 'City is required.'),
  neighborhood: z.string().min(1, 'Neighborhood is required.'),
  serviceCategory: z.string().min(1, 'Service category is required.'),
  currentProviderRating: z.number().min(1).max(5),
});

export type FormState = {
  data?: SuggestAlternativeServiceProviderOutput | null;
  error?: string | null;
  success: boolean;
};

export async function getAlternativeProviders(
  data: SuggestAlternativeServiceProviderInput
): Promise<FormState> {
  const validationResult = SuggestAlternativeServiceProviderInputSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors.map((e) => e.message).join(' '),
    };
  }

  try {
    const result = await suggestAlternativeServiceProvider(validationResult.data);
    if (result.alternativeProviders.length === 0) {
      return {
        success: true,
        data: result,
        error: 'No alternative providers found for the given criteria. Please try different inputs.',
      };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
