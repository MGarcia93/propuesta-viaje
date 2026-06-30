import { defineCollection } from 'astro:content';
import { tripSchema } from '../schemas/trip.schema';

export const collections = {
  trips: defineCollection({
    type: 'data',
    schema: tripSchema,
  }),
};
