import type { Trip } from '../schemas/trip.schema';
import type { BudgetTotals } from './types';

/**
 * Calculate budget totals from items.
 * Excludes items with status 'pending' from the total.
 * Returns derived totals that override any authored `calculatedTotals`.
 */
export function calculateBudgetTotal(budget: Trip['budget']): BudgetTotals {
  const items = budget?.items ?? [];

  const confirmedItems = items.filter(
    (item) => item.status !== 'pending' && item.amountPerPerson != null,
  );
  const hasConfirmed = confirmedItems.length > 0;
  const hasPending = items.some((item) => item.status === 'pending');

  const subtotalPerPerson = hasConfirmed
    ? confirmedItems.reduce((sum, item) => sum + (item.amountPerPerson ?? 0), 0)
    : null;

  const contingencyAmount = budget?.contingency?.amountPerPerson ?? null;

  const totalPerPerson =
    subtotalPerPerson != null
      ? subtotalPerPerson + (contingencyAmount ?? 0)
      : null;

  const travelers = budget?.travelers ?? 1;
  const totalGroup =
    totalPerPerson != null ? totalPerPerson * travelers : null;

  return {
    subtotalPerPerson,
    totalPerPerson,
    totalGroup,
    pendingItems: hasPending,
  };
}

/**
 * Attach recalculated budget totals to a trip.
 * Returns a copy of the trip with `budget.calculatedTotals`
 * set to the value derived from items (not the authored value).
 * Useful in page frontmatter where the trip is needed with reliable totals.
 */
export function attachCalculatedTotals(trip: Trip): Trip {
  return {
    ...trip,
    budget: {
      ...(trip.budget ?? { items: [] }),
      calculatedTotals: calculateBudgetTotal(trip.budget),
    },
  };
}
