import type { Trip } from '../schemas/trip.schema';
import type { ResolvedSlideSource } from './types';

/**
 * Resolve the source data for a slide given its sourceRef.
 *
 * Supported namespaces:
 *   - route, budget, strengths, tradeoffs, scores, comparison (simple)
 *   - destinations.<id>, gallery.<id> (dot notation)
 *   - itinerary.days-<start>-<end> (range)
 *   - Composite: "strengths, tradeoffs" (comma-separated)
 */
export function resolveSlideSource(
  trip: Trip,
  sourceRef: string | null | undefined,
): ResolvedSlideSource {
  if (!sourceRef) {
    return { type: 'own-content', data: null };
  }

  const refs = sourceRef.split(',').map((r) => r.trim()).filter(Boolean);

  if (refs.length === 1) {
    const ref = refs[0];

    // itinerary.days-<start>-<end>
    const itMatch = ref.match(/^itinerary\.days-(\d+)-(\d+)$/);
    if (itMatch) {
      const start = Number(itMatch[1]);
      const end = Number(itMatch[2]);
      const days = trip.itinerary.filter(
        (d) => d.day >= start && d.day <= end,
      );
      return { type: 'reference', data: days };
    }

    // destinations.<id> or gallery.<id>
    const dotMatch = ref.match(/^(destinations|gallery)\.(.+)$/);
    if (dotMatch) {
      const prefix = dotMatch[1];
      const id = dotMatch[2];
      if (prefix === 'destinations') {
        const dest = trip.destinations.find((d) => d.id === id);
        return { type: 'reference', data: dest ?? null };
      }
      if (prefix === 'gallery') {
        const img = trip.gallery.find(
          (g) => g.alt === id || g.city === id,
        );
        return { type: 'reference', data: img ?? null };
      }
    }

    // Simple namespaces
    const simpleMap: Record<string, unknown> = {
      route: trip.route,
      budget: trip.budget,
      strengths: trip.strengths,
      tradeoffs: trip.tradeoffs,
      scores: trip.scores,
      comparison: trip.comparison,
    };

    if (ref in simpleMap) {
      return { type: 'reference', data: simpleMap[ref] };
    }

    return { type: 'own-content', data: null };
  }

  // Composite refs (e.g., "strengths, tradeoffs")
  const composite: Record<string, unknown> = {};
  for (const ref of refs) {
    const simpleMap: Record<string, unknown> = {
      route: trip.route,
      budget: trip.budget,
      strengths: trip.strengths,
      tradeoffs: trip.tradeoffs,
      scores: trip.scores,
      comparison: trip.comparison,
    };
    if (ref in simpleMap) {
      composite[ref] = simpleMap[ref];
    }
  }

  return Object.keys(composite).length > 0
    ? { type: 'reference', data: composite }
    : { type: 'own-content', data: null };
}

/**
 * Resolve a destination by its ID.
 */
export function resolveDestination(
  trip: Trip,
  id: string,
): Trip['destinations'][number] | undefined {
  return trip.destinations.find((d) => d.id === id);
}

/**
 * Resolve an itinerary range.
 */
export function resolveItineraryRange(
  trip: Trip,
  startDay: number,
  endDay: number,
): Trip['itinerary'] {
  return trip.itinerary.filter(
    (d) => d.day >= startDay && d.day <= endDay,
  );
}
