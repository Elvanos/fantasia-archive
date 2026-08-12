/**
 * True when Last opened visibility would toggle (0 rows ↔ any rows).
 */
export function didProjectOverviewLastOpenedEmptyBoundaryCross (
  previousCount: number,
  nextCount: number
): boolean {
  return (previousCount === 0) !== (nextCount === 0)
}
