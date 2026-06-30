import { z } from 'astro:content';

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export const TripStatus = z.enum([
  'draft',
  'incomplete',
  'ready',
  'published',
]);

export const SlideType = z.enum([
  'cover',
  'editorial',
  'reasons',
  'route',
  'destination',
  'city',
  'highlight',
  'gallery',
  'full-image',
  'split-image',
  'itinerary',
  'pace',
  'nightlife',
  'gastronomy',
  'budget',
  'pros-cons',
  'comparison-summary',
  'closing',
]);

export const ValueStatus = z.enum([
  'confirmed',
  'estimated',
  'pending',
]);

export const Pace = z.enum(['relaxed', 'moderate', 'intense']);

export const BudgetLevel = z.enum(['low', 'medium', 'high', 'premium']);

export const ImageOrientation = z.enum(['landscape', 'portrait', 'square']);

export const SlideLayout = z.enum([
  'default',
  'collage',
  'grid',
  'masonry',
  'hero-with-thumbs',
  'side-by-side',
  'full-bleed',
  'text-left',
  'text-right',
]);

export const Intensity = z.enum(['relaxed', 'moderate', 'intense']);

export const Impact = z.enum(['low', 'medium', 'high']);

export const ImageSize = z.enum(['large', 'medium', 'small', 'wide', 'full']);

export const FlightType = z.enum(['international', 'domestic', 'regional']);

export const TransportType = z.enum([
  'flight',
  'train',
  'bus',
  'ferry',
  'private-transfer',
  'taxi',
  'local-transport',
  'rental-car',
]);

// ──────────────────────────────────────────────
// Derived / inferred types
// ──────────────────────────────────────────────

export type TripStatus = z.infer<typeof TripStatus>;
export type SlideType = z.infer<typeof SlideType>;
export type ValueStatus = z.infer<typeof ValueStatus>;
export type Pace = z.infer<typeof Pace>;
export type BudgetLevel = z.infer<typeof BudgetLevel>;
export type ImageOrientation = z.infer<typeof ImageOrientation>;
export type SlideLayout = z.infer<typeof SlideLayout>;
export type Intensity = z.infer<typeof Intensity>;
export type Impact = z.infer<typeof Impact>;
export type ImageSize = z.infer<typeof ImageSize>;
export type FlightType = z.infer<typeof FlightType>;
export type TransportType = z.infer<typeof TransportType>;

// ──────────────────────────────────────────────
// Reusable field patterns
// ──────────────────────────────────────────────

/**
 * Nullable number for amounts/values that may be pending.
 * The `status` sibling (ValueStatus) tracks whether the value
 * is confirmed, estimated, or still pending.
 */
const nullableNumber = z.number().nullable().optional();

const valueStatusField = z.object({
  value: z.union([z.string(), z.number()]).nullable().optional(),
  status: ValueStatus.optional(),
  source: z.string().nullable().optional(),
  lastUpdated: z.string().nullable().optional(),
});

const imageRef = z.object({
  src: z.string().nullable().optional(),
  alt: z.string(),
  caption: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  size: ImageSize.optional(),
  orientation: ImageOrientation.optional(),
  status: ValueStatus.optional(),
});

// ──────────────────────────────────────────────
// Budget sub-schemas
// ──────────────────────────────────────────────

const budgetItem = z.object({
  category: z.string(),
  label: z.string(),
  amountPerPerson: nullableNumber,
  note: z.string().nullable().optional(),
  status: ValueStatus.optional(),
});

const contingency = z.object({
  amountPerPerson: nullableNumber,
  percentage: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
});

const calculatedTotals = z.object({
  subtotalPerPerson: nullableNumber,
  totalPerPerson: nullableNumber,
  totalGroup: nullableNumber,
});

// ──────────────────────────────────────────────
// Sub-object schemas
// ──────────────────────────────────────────────

const identificationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  status: TripStatus,
  version: z.number().optional(),
  lastUpdated: z.string(),
  countries: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  durationDays: z.number(),
  durationNights: z.number(),
  estimatedDates: z
    .object({
      month: z.string().optional(),
      year: z.number().optional(),
      status: ValueStatus.optional(),
    })
    .optional(),
  recommendedSeason: valueStatusField.optional(),
  travelers: z.number().optional(),
  departureCity: z.union([z.string(), valueStatusField]).optional(),
  arrivalCity: z.union([z.string(), valueStatusField]).optional(),
  returnCity: z.union([z.string(), valueStatusField]).optional(),
});

const catalogSchema = z.object({
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  pace: Pace,
  budgetLevel: BudgetLevel,
  bestArgument: z.string().nullable().optional(),
  mainConcession: z.string().nullable().optional(),
});

const visualSchema = z.object({
  accentColor: z.string().nullable().optional(),
  textColor: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  cardImage: z.string().nullable().optional(),
  socialImage: z.string().nullable().optional(),
  imageStyle: z.string().nullable().optional(),
});

const scoresSchema = z.object({
  culture: z.number().min(1).max(5).nullable().optional(),
  nature: z.number().min(1).max(5).nullable().optional(),
  nightlife: z.number().min(1).max(5).nullable().optional(),
  gastronomy: z.number().min(1).max(5).nullable().optional(),
  relaxation: z.number().min(1).max(5).nullable().optional(),
  adventure: z.number().min(1).max(5).nullable().optional(),
  technology: z.number().min(1).max(5).nullable().optional(),
  comfort: z.number().min(1).max(5).nullable().optional(),
  organizationDifficulty: z.number().min(1).max(5).nullable().optional(),
  budgetAccessibility: z.number().min(1).max(5).nullable().optional(),
  variety: z.number().min(1).max(5).nullable().optional(),
  visualImpact: z.number().min(1).max(5).nullable().optional(),
});

const scoreRationaleSchema = z.object({
  culture: z.string().optional(),
  nature: z.string().optional(),
  nightlife: z.string().optional(),
  gastronomy: z.string().optional(),
  relaxation: z.string().optional(),
  adventure: z.string().optional(),
  technology: z.string().optional(),
  comfort: z.string().optional(),
  organizationDifficulty: z.string().optional(),
  budgetAccessibility: z.string().optional(),
  variety: z.string().optional(),
  visualImpact: z.string().optional(),
});

const conceptSchema = z
  .object({
    overview: z.string().nullable().optional(),
    reasons: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      )
      .default([]),
    idealFor: z.array(z.string()).default([]),
    notIdealFor: z.array(z.string()).default([]),
  })
  .optional();

const routeEntrySchema = z.object({
  order: z.number(),
  city: z.string(),
  country: z.string(),
  nights: z.number(),
  role: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  transportFromPrevious: z.string().nullable().optional(),
  transferDuration: z.string().nullable().optional(),
  arrivalMethod: z.string().nullable().optional(),
  departureMethod: z.string().nullable().optional(),
});

const destinationSchema = z.object({
  id: z.string(),
  city: z.string(),
  country: z.string(),
  nights: z.number(),
  pace: Pace.optional(),
  role: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  whyIncluded: z.string().nullable().optional(),
  freeTime: z.string().nullable().optional(),
  notes: z.array(z.string()).default([]),
  activities: z
    .array(
      z.object({
        name: z.string(),
        category: z.string().optional(),
        description: z.string().nullable().optional(),
        estimatedDuration: z.string().nullable().optional(),
        optional: z.boolean().optional(),
        estimatedCostPerPerson: nullableNumber,
        status: ValueStatus.optional(),
      }),
    )
    .default([]),
  nightlife: z
    .array(
      z.object({
        name: z.string(),
        type: z.string().optional(),
        description: z.string().nullable().optional(),
        optional: z.boolean().optional(),
        estimatedCostPerPerson: nullableNumber,
        status: ValueStatus.optional(),
      }),
    )
    .default([]),
  foodHighlights: z
    .array(
      z.object({
        name: z.string(),
        type: z.string().optional(),
        description: z.string().nullable().optional(),
        estimatedCostPerPerson: nullableNumber,
        status: ValueStatus.optional(),
      }),
    )
    .default([]),
  images: z.array(imageRef).default([]),
});

const itineraryEntrySchema = z.object({
  day: z.number(),
  city: z.string(),
  title: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  intensity: Intensity.optional(),
  transport: z.string().nullable().optional(),
  freeTimeHours: z.number().nullable().optional(),
  morning: z.array(z.string()).default([]),
  afternoon: z.array(z.string()).default([]),
  evening: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        src: z.string().nullable().optional(),
        alt: z.string(),
        caption: z.string().nullable().optional(),
        status: ValueStatus.optional(),
      }),
    )
    .default([]),
});

const budgetSchema = z.object({
  currency: z.string().optional(),
  travelers: z.number().optional(),
  priceBasis: z.string().optional(),
  disclaimer: z.string().nullable().optional(),
  lastUpdated: z.string().nullable().optional(),
  items: z.array(budgetItem).default([]),
  contingency: contingency.optional(),
  calculatedTotals: calculatedTotals.optional(),
});

const flightSchema = z.object({
  type: FlightType.optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  departureDate: z.string().nullable().optional(),
  arrivalDate: z.string().nullable().optional(),
  airline: z.string().nullable().optional(),
  stops: z.number().nullable().optional(),
  duration: z.string().nullable().optional(),
  baggageIncluded: z.boolean().nullable().optional(),
  amountPerPerson: nullableNumber,
  source: z.string().nullable().optional(),
  status: ValueStatus.optional(),
});

const accommodationSchema = z.object({
  city: z.string().optional(),
  nights: z.number().optional(),
  type: z.string().nullable().optional(),
  area: z.string().nullable().optional(),
  rooms: z.number().nullable().optional(),
  peoplePerRoom: z.number().nullable().optional(),
  breakfastIncluded: z.boolean().nullable().optional(),
  amountPerNight: nullableNumber,
  amountPerPerson: nullableNumber,
  totalAmount: nullableNumber,
  source: z.string().nullable().optional(),
  status: ValueStatus.optional(),
  notes: z.array(z.string()).default([]),
});

const transportSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  type: TransportType.optional(),
  duration: z.string().nullable().optional(),
  overnight: z.boolean().nullable().optional(),
  amountPerPerson: nullableNumber,
  source: z.string().nullable().optional(),
  status: ValueStatus.optional(),
  notes: z.string().nullable().optional(),
});

const paceSummarySchema = z
  .object({
    relaxedDays: z.number().optional(),
    moderateDays: z.number().optional(),
    intenseDays: z.number().optional(),
    accommodationChanges: z.number().optional(),
    longTransfers: z.number().optional(),
    activityNights: z.number().optional(),
    freeTimeDays: z.number().optional(),
    description: z.string().nullable().optional(),
  })
  .optional();

const nightlifeSummarySchema = z
  .object({
    overview: z.string().nullable().optional(),
    quietNights: z.number().optional(),
    urbanNights: z.number().optional(),
    partyOptionalNights: z.number().optional(),
    experiences: z
      .array(
        z.object({
          city: z.string().optional(),
          name: z.string(),
          type: z.string().optional(),
          description: z.string().nullable().optional(),
          optional: z.boolean().optional(),
          estimatedCostPerPerson: nullableNumber,
          status: ValueStatus.optional(),
        }),
      )
      .default([]),
  })
  .optional();

const gastronomySchema = z
  .object({
    overview: z.string().nullable().optional(),
    dailyBudgetLow: z.number().nullable().optional(),
    dailyBudgetMedium: z.number().nullable().optional(),
    dailyBudgetComfortable: z.number().nullable().optional(),
    experiences: z
      .array(
        z.object({
          city: z.string().optional(),
          name: z.string(),
          type: z.string().optional(),
          description: z.string().nullable().optional(),
          estimatedCostPerPerson: nullableNumber,
          status: ValueStatus.optional(),
        }),
      )
      .default([]),
    possibleDifficulties: z.array(z.string()).default([]),
  })
  .optional();

const logisticsSchema = z
  .object({
    internationalFlightDuration: valueStatusField.optional(),
    internalFlights: z.number().optional(),
    trainTrips: z.number().optional(),
    busTrips: z.number().optional(),
    longestTransfer: z.string().nullable().optional(),
    accommodationChanges: z.number().optional(),
  })
  .optional();

const requirementsSchema = z
  .object({
    visa: valueStatusField.optional(),
    passport: valueStatusField.optional(),
    vaccines: valueStatusField.optional(),
    travelInsurance: valueStatusField.optional(),
    connectivity: valueStatusField.optional(),
    paymentMethods: valueStatusField.optional(),
    language: valueStatusField.optional(),
    restrictions: valueStatusField.optional(),
  })
  .optional();

const slideSchema = z.object({
  id: z.string(),
  type: SlideType,
  order: z.number().optional(),
  title: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  eyebrow: z.string().nullable().optional(),
  text: z.string().nullable().optional(),
  layout: SlideLayout.optional(),
  image: z.string().nullable().optional(),
  images: z.array(imageRef).default([]),
  sourceRef: z.string().nullable().optional(),
});

const sourceSchema = z.object({
  topic: z.string().optional(),
  name: z.string(),
  url: z.string().nullable().optional(),
  accessedAt: z.string(),
  notes: z.string().nullable().optional(),
});

const missingInfoSchema = z.object({
  field: z.string(),
  reason: z.string().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high', 'blocking']).optional(),
  suggestedAction: z.string().nullable().optional(),
});

const riskSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  impact: Impact.optional(),
  status: ValueStatus.optional(),
});

const comparisonSchema = z
  .object({
    durationDays: z.number().optional(),
    durationNights: z.number().optional(),
    countriesCount: z.number().optional(),
    citiesCount: z.number().optional(),
    accommodationChanges: z.number().optional(),
    longTransfers: z.number().optional(),
    internationalFlightHours: z.number().nullable().optional(),
    requiresVisa: z.union([z.boolean(), z.string()]).nullable().optional(),
    organizationDifficulty: z.number().min(1).max(5).nullable().optional(),
    languageBarrier: z.number().min(1).max(5).nullable().optional(),
    comfort: z.number().min(1).max(5).nullable().optional(),
    freeTime: z.number().nullable().optional(),
    experienceVariety: z.number().nullable().optional(),
    totalPerPerson: nullableNumber,
    budgetLevel: BudgetLevel.optional(),
    pace: Pace.optional(),
  })
  .optional();

const alternativesSchema = z
  .object({
    moreRelaxed: z
      .object({
        description: z.string().optional(),
        changes: z.array(z.string()).default([]),
      })
      .optional(),
    cheaper: z
      .object({
        description: z.string().optional(),
        changes: z.array(z.string()).default([]),
      })
      .optional(),
    moreComplete: z
      .object({
        description: z.string().optional(),
        changes: z.array(z.string()).default([]),
      })
      .optional(),
  })
  .optional();

// ──────────────────────────────────────────────
// Main trip schema
// ──────────────────────────────────────────────

export const tripSchema = z
  .object({
    // Identification
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    shortName: z.string().optional(),
    status: TripStatus,
    version: z.number().optional(),
    lastUpdated: z.string(),

    countries: z.array(z.string()).default([]),
    regions: z.array(z.string()).default([]),

    durationDays: z.number(),
    durationNights: z.number(),

    estimatedDates: z
      .object({
        month: z.string().optional(),
        year: z.number().optional(),
        status: ValueStatus.optional(),
      })
      .optional(),

    recommendedSeason: valueStatusField.optional(),
    travelers: z.number().optional(),
    departureCity: z.union([z.string(), valueStatusField]).optional(),
    arrivalCity: z.union([z.string(), valueStatusField]).optional(),
    returnCity: z.union([z.string(), valueStatusField]).optional(),

    // Catalog
    catalog: catalogSchema,

    // Visual identity
    visual: visualSchema.optional(),

    // Scores
    scores: scoresSchema.optional(),
    scoreRationale: scoreRationaleSchema.optional(),

    // Concept
    concept: conceptSchema,

    // Route
    route: z.array(routeEntrySchema).default([]),

    // Destinations
    destinations: z.array(destinationSchema).default([]),

    // Itinerary
    itinerary: z.array(itineraryEntrySchema).default([]),

    // Budget
    budget: budgetSchema.optional(),

    // Flights, accommodations, transports
    flights: z.array(flightSchema).default([]),
    accommodations: z.array(accommodationSchema).default([]),
    transports: z.array(transportSchema).default([]),

    // Summaries
    paceSummary: paceSummarySchema,
    nightlifeSummary: nightlifeSummarySchema,
    gastronomy: gastronomySchema,

    // Logistics
    logistics: logisticsSchema,
    requirements: requirementsSchema,

    // Strengths, tradeoffs, risks, alternatives
    strengths: z.array(z.string()).default([]),
    tradeoffs: z.array(z.string()).default([]),
    risks: z.array(riskSchema).default([]),
    alternatives: alternativesSchema,

    // Comparison
    comparison: comparisonSchema,

    // Slides
    slides: z.array(slideSchema).default([]),

    // Gallery
    gallery: z.array(imageRef).default([]),

    // Sources
    sources: z.array(sourceSchema).default([]),

    // Missing information
    missingInformation: z.array(missingInfoSchema).default([]),
  })
  .superRefine((data, ctx) => {
    // Coherence: durationDays >= durationNights
    if (data.durationDays < data.durationNights) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `durationDays (${data.durationDays}) must be >= durationNights (${data.durationNights})`,
        path: ['durationDays'],
      });
    }

    // Coherence: sum of route nights === durationNights
    if (data.route.length > 0) {
      const totalRouteNights = data.route.reduce(
        (sum, entry) => sum + entry.nights,
        0,
      );
      if (totalRouteNights !== data.durationNights) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Sum of route nights (${totalRouteNights}) must equal durationNights (${data.durationNights})`,
          path: ['route'],
        });
      }
    }

    // Coherence: slides must have unique IDs
    const slideIds = data.slides.map((s) => s.id);
    const uniqueSlideIds = new Set(slideIds);
    if (uniqueSlideIds.size !== slideIds.length) {
      const seen = new Set<string>();
      const duplicates = slideIds.filter((id) => {
        if (seen.has(id)) return true;
        seen.add(id);
        return false;
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate slide IDs: ${[...new Set(duplicates)].join(', ')}`,
        path: ['slides'],
      });
    }

    // Coherence: sourceRef namespaces
    const validSimpleNamespaces = new Set([
      'route', 'budget', 'scores', 'comparison',
      'strengths', 'tradeoffs',
    ]);

    data.slides.forEach((slide, index) => {
      if (!slide.sourceRef) return;

      const refs = slide.sourceRef.split(',').map((r) => r.trim());

      refs.forEach((ref) => {
        if (!ref) return;

        // itinerary.days-<start>-<end>
        const itMatch = ref.match(
          /^itinerary\.days-(\d+)-(\d+)$/,
        );
        if (itMatch) {
          const start = Number(itMatch[1]);
          const end = Number(itMatch[2]);
          if (start >= end) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                `Invalid itinerary range in slide "${slide.id}": start day (${start}) must be less than end day (${end})`,
              path: ['slides', index, 'sourceRef'],
            });
          }
          return;
        }

        // destinations.<id> or gallery.<id>
        const dotMatch = ref.match(
          /^(destinations|gallery)\.(.+)$/,
        );
        if (dotMatch) {
          const id = dotMatch[2]?.trim();
          if (!id) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                `Invalid sourceRef "${ref}" in slide "${slide.id}": ${dotMatch[1]} requires an ID after the dot`,
              path: ['slides', index, 'sourceRef'],
            });
          }
          return;
        }

        // Simple namespaces
        if (validSimpleNamespaces.has(ref)) return;

        // Unknown namespace
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            `Invalid sourceRef "${ref}" in slide "${slide.id}": unsupported namespace. ` +
            `Must be one of: route, budget, strengths, tradeoffs, scores, comparison, ` +
            `destinations.<id>, gallery.<id>, itinerary.days-<start>-<end>`,
          path: ['slides', index, 'sourceRef'],
        });
      });
    });
  });

// ──────────────────────────────────────────────
// Exported types
// ──────────────────────────────────────────────

export type Trip = z.infer<typeof tripSchema>;
