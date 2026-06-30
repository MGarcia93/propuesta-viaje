import type {
  TripComparisonProjection,
  ComparisonSummary,
} from './types';

/**
 * Compare multiple trips' scores and return the one with the highest value
 * for the given score dimension.
 */
export function getBestByScore(
  trips: TripComparisonProjection[],
  score: keyof NonNullable<TripComparisonProjection['scores']>,
): { slug: string; score: string; value: number } | null {
  let best: { slug: string; value: number } | null = null;

  for (const trip of trips) {
    const val = trip.scores?.[score];
    if (typeof val === 'number' && (best === null || val > best.value)) {
      best = { slug: trip.slug, value: val };
    }
  }

  return best
    ? { slug: best.slug, score: String(score), value: best.value }
    : null;
}

/**
 * Find the cheapest trip among those with complete (non-pending) budget totals.
 */
export function getCheapestTrip(
  trips: TripComparisonProjection[],
): { slug: string; totalPerPerson: number } | null {
  const complete = trips.filter(
    (t) =>
      t.budgetTotals.totalPerPerson != null && !t.budgetTotals.pendingItems,
  );
  if (complete.length === 0) return null;
  return complete.reduce((a, b) =>
    (a.budgetTotals.totalPerPerson ?? Infinity) <
    (b.budgetTotals.totalPerPerson ?? Infinity)
      ? a
      : b,
  );
}

/**
 * Find the most expensive trip among those with complete budget totals.
 */
export function getMostExpensiveTrip(
  trips: TripComparisonProjection[],
): { slug: string; totalPerPerson: number } | null {
  const complete = trips.filter(
    (t) =>
      t.budgetTotals.totalPerPerson != null && !t.budgetTotals.pendingItems,
  );
  if (complete.length === 0) return null;
  return complete.reduce((a, b) =>
    (a.budgetTotals.totalPerPerson ?? 0) >
    (b.budgetTotals.totalPerPerson ?? 0)
      ? a
      : b,
  );
}

/**
 * Find the most relaxed trip based on pace order: relaxed < moderate < intense.
 */
export function getMostRelaxedTrip(
  trips: TripComparisonProjection[],
): { slug: string; pace: string } | null {
  const paceOrder: Record<string, number> = {
    relaxed: 0,
    moderate: 1,
    intense: 2,
  };

  let mostRelaxed: { slug: string; pace: string } | null = null;
  let lowestOrder = Infinity;

  for (const trip of trips) {
    const pace = trip.catalog?.pace;
    if (pace) {
      const order = paceOrder[pace] ?? 99;
      if (order < lowestOrder) {
        lowestOrder = order;
        mostRelaxed = { slug: trip.slug, pace };
      }
    }
  }

  return mostRelaxed;
}

/**
 * Build a full comparison summary from all published trips.
 */
export function buildComparisonSummary(
  trips: TripComparisonProjection[],
): ComparisonSummary {
  const scoreKeys: (keyof NonNullable<TripComparisonProjection['scores']>)[] =
    [
      'culture',
      'nature',
      'nightlife',
      'gastronomy',
      'relaxation',
      'adventure',
      'technology',
      'comfort',
      'variety',
      'visualImpact',
    ];

  const scoreResults = scoreKeys
    .map((key) => getBestByScore(trips, key))
    .filter(Boolean) as NonNullable<ReturnType<typeof getBestByScore>>[];

  const bestOverallScore =
    scoreResults.length > 0
      ? scoreResults.reduce((a, b) => (a.value >= b.value ? a : b))
      : null;

  return {
    bestByScore: bestOverallScore,
    cheapest: getCheapestTrip(trips),
    mostExpensive: getMostExpensiveTrip(trips),
    mostRelaxed: getMostRelaxedTrip(trips),
    longest:
      trips.length > 0
        ? trips.reduce((a, b) =>
            a.durationDays >= b.durationDays ? a : b,
          )
        : null,
    shortest:
      trips.length > 0
        ? trips.reduce((a, b) =>
            a.durationDays <= b.durationDays ? a : b,
          )
        : null,
    tripCount: trips.length,
  };
}
