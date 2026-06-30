import type { Trip } from '../schemas/trip.schema';

// ──────────────────────────────────────────────
// Shared projection types
// ──────────────────────────────────────────────

export interface BudgetTotals {
  subtotalPerPerson: number | null;
  totalPerPerson: number | null;
  totalGroup: number | null;
  pendingItems: boolean;
}

export interface TripCardProjection {
  slug: string;
  name: string;
  shortName?: string;
  catalog: Trip['catalog'];
  visual: NonNullable<Trip['visual']>;
  durationDays: number;
  durationNights: number;
  budgetLevel: Trip['budgetLevel'];
  scores: NonNullable<Trip['scores']>;
  comparison: NonNullable<Trip['comparison']>;
  budgetTotals: BudgetTotals;
}

export interface TripComparisonProjection extends TripCardProjection {
  // Same fields as card projection for Phase 2.
  // Phase 3 may refine this if additional comparison-specific fields are needed.
}

export interface ComparisonSummary {
  bestByScore: { slug: string; score: string; value: number } | null;
  cheapest: { slug: string; totalPerPerson: number } | null;
  mostExpensive: { slug: string; totalPerPerson: number } | null;
  mostRelaxed: { slug: string; pace: string } | null;
  longest: { slug: string; days: number } | null;
  shortest: { slug: string; days: number } | null;
  tripCount: number;
}

export interface ResolvedSlideSource {
  type: 'reference' | 'own-content';
  data: unknown;
}
