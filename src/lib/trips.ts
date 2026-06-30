import { getCollection } from 'astro:content';
import type { Trip } from '../schemas/trip.schema';
import type {
  TripCardProjection,
  TripComparisonProjection,
} from './types';
import { calculateBudgetTotal } from './budget';

// ──────────────────────────────────────────────
// Data access
// ──────────────────────────────────────────────

/**
 * Get all trips from the content collection.
 */
export async function getAllTrips(): Promise<Trip[]> {
  const entries = await getCollection('trips');
  return entries.map((entry) => entry.data);
}

/**
 * Get only published trips.
 */
export async function getPublishedTrips(): Promise<Trip[]> {
  const all = await getAllTrips();
  return all.filter((t) => t.status === 'published');
}

/**
 * Get a single trip by slug.
 */
export async function getTripBySlug(
  slug: string,
): Promise<Trip | undefined> {
  const all = await getAllTrips();
  return all.find((t) => t.slug === slug);
}

// ──────────────────────────────────────────────
// Projections
// ──────────────────────────────────────────────

/**
 * Build a lightweight card projection from a trip.
 */
function toCardProjection(trip: Trip): TripCardProjection {
  return {
    slug: trip.slug,
    name: trip.name,
    shortName: trip.shortName,
    catalog: trip.catalog,
    visual: trip.visual ?? {},
    durationDays: trip.durationDays,
    durationNights: trip.durationNights,
    budgetLevel: trip.budgetLevel,
    scores: trip.scores ?? {},
    comparison: trip.comparison ?? {},
    budgetTotals: calculateBudgetTotal(trip.budget),
  };
}

/**
 * Get card projections for all published trips.
 * Used by the home page catalog.
 */
export async function getTripCardProjections(): Promise<TripCardProjection[]> {
  const published = await getPublishedTrips();
  return published.map(toCardProjection);
}

/**
 * Get comparison projections for all published trips.
 * Used by the comparison page.
 */
export async function getTripComparisonProjections(): Promise<TripComparisonProjection[]> {
  const published = await getPublishedTrips();
  return published.map(toCardProjection);
}

/**
 * Get adjacent trips (previous/next) for a given slug.
 */
export async function getAdjacentTrips(
  slug: string,
): Promise<{ prev: TripCardProjection | null; next: TripCardProjection | null }> {
  const projections = await getTripCardProjections();
  const index = projections.findIndex((t) => t.slug === slug);

  return {
    prev: index > 0 ? projections[index - 1] : null,
    next: index >= 0 && index < projections.length - 1 ? projections[index + 1] : null,
  };
}
