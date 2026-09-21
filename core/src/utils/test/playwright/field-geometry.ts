import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * These tracks are adjacent with no gap, so the edges are meant to be equal.
 * Engines round fractional track origins differently, and a real ordering
 * regression moves a cell by a whole track, so a pixel of slack is safe.
 */
const EDGE_TOLERANCE = 1;

/**
 * Asserts that a form field's start slot, control and end slot occupy one row,
 * in inline order.
 *
 * The ionic theme lays these out as grid columns. An invalid column template is
 * dropped silently, and the cells then auto-place into a row each, so checking
 * that they share a row is what catches it.
 *
 * @param host The form field element.
 * @param prefix The component's cell-class prefix: `input`, `select` or `textarea`.
 */
export const expectFieldCellsShareARow = async (host: Locator, prefix: string) => {
  const start = await host.locator(`.${prefix}-start`).boundingBox();
  const native = await host.locator('.native-wrapper').boundingBox();
  const end = await host.locator(`.${prefix}-end`).boundingBox();

  expect(native).not.toBeNull();

  for (const cell of [start, end]) {
    expect(cell).not.toBeNull();
    expect(cell!.y).toBeLessThan(native!.y + native!.height);
    expect(native!.y).toBeLessThan(cell!.y + cell!.height);
  }

  expect(native!.x).toBeGreaterThan(start!.x + start!.width - EDGE_TOLERANCE);
  expect(end!.x).toBeGreaterThan(native!.x + native!.width - EDGE_TOLERANCE);
};
