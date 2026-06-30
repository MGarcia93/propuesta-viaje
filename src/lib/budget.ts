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
  const pendingItems = items.some((item) => item.status === 'pending');

  const subtotalPerPerson = confirmedItems.reduce(
    (sum, item) => sum + (item.amountPerPerson ?? 0),
    0,
  );

  const contingencyAmount =
    budget?.contingency?.amountPerPerson ?? null;

  const totalPerPerson =
    contingencyAmount != null
      ? subtotalPerPerson + contingencyAmount
      : subtotalPerPerson;

  const travelers = budget?.travelers ?? 1;
  const totalGroup = totalPerPerson != null ? totalPerPerson * travelers : null;

  return {
    subtotalPerPerson: subtotalPerPerson > 0 ? subtotalPerPerson : null,
    totalPerPerson: totalPerPerson > 0 ? totalPerPerson : null,
    totalGroup,
    pendingItems,
  };
}
