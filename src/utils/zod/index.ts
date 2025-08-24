import { z } from 'zod';

const createNumericStringSchema = () => {
  const baseSchema = z
    .string()
    .refine((val) => !isNaN(Number(val)) && val.trim() !== '', {
      message: 'Must be a valid number',
    })
    .refine((val) => isFinite(Number(val)), {
      message: 'Must be a finite number',
    });

  return Object.assign(baseSchema, {
    min: (value: number, message?: string) =>
      createNumericStringSchema().refine((val) => Number(val) >= value, {
        message: message || `Must be at least ${value}`,
      }),

    max: (value: number, message?: string) =>
      createNumericStringSchema().refine((val) => Number(val) <= value, {
        message: message || `Must be at most ${value}`,
      }),

    positive: (message?: string) =>
      createNumericStringSchema().refine((val) => Number(val) > 0, {
        message: message || 'Must be positive',
      }),

    nonnegative: (message?: string) =>
      createNumericStringSchema().refine((val) => Number(val) >= 0, {
        message: message || 'Must be non-negative',
      }),

    int: (message?: string) =>
      createNumericStringSchema().refine((val) => Number.isInteger(Number(val)), {
        message: message || 'Must be an integer',
      }),

    range: (min: number, max: number, message?: string) =>
      createNumericStringSchema().refine((val) => Number(val) >= min && Number(val) <= max, {
        message: message || `Must be between ${min} and ${max}`,
      }),
  });
};

export const numericString = createNumericStringSchema;

const EN_ONLY_REGEX = /^[A-Za-z\s]+$/;
const FA_ONLY_REGEX = /^[\u0600-\u06FF\u200C\s]+$/u; // Persian letters + ZWNJ + space

export const englishOnlyString = () =>
  z
    .string()
    .min(1)
    .refine((val) => EN_ONLY_REGEX.test(val), {
      params: {
        i18n: 'custom.onlyEnglishLetters',
      },
    });

export const farsiOnlyString = () =>
  z
    .string()
    .min(1)
    .refine((val) => FA_ONLY_REGEX.test(val), {
      params: {
        i18n: 'custom.onlyFarsiLetters',
      },
    });
