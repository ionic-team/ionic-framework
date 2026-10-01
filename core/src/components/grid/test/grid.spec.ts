import { config } from '@global/config';
import { forceUpdate } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { resetBreakpointListeners, resetScreenBreakpoints } from '@utils/breakpoints';
import { Grid } from '../grid';

/**
 * The default widths the assertions below are written against:
 *
 * | xs | sm  | md  | lg  | xl   | xxl  |
 * | -- | --- | --- | --- | ---- | ---- |
 * | 0  | 576 | 768 | 992 | 1200 | 1400 |
 */

describe('ion-grid', () => {
  let listeners: Array<() => void>;
  let width: number;

  /**
   * `newSpecPage` replaces `window.matchMedia` with its own mock, so the grid
   * has to be appended after this is installed for `connectedCallback` to
   * subscribe.
   */
  const installMatchMedia = () => {
    listeners = [];
    (window as any).matchMedia = (query: string) => {
      const min = Number(/\(min-width:\s*(\d+)px\)/.exec(query)?.[1] ?? NaN);

      return {
        get matches() {
          return Number.isFinite(min) && width >= min;
        },
        addEventListener: (_type: string, listener: () => void) => listeners.push(listener),
        removeEventListener: () => undefined,
      };
    };
  };

  const resize = (next: number) => {
    width = next;
    listeners.forEach((listener) => listener());
  };

  const renderGrid = async (screenWidth: number) => {
    width = screenWidth;
    const page = await newSpecPage({ components: [Grid], html: `<div id="host"></div>` });

    installMatchMedia();

    const grid = page.doc.createElement('ion-grid');
    page.body.querySelector('#host')!.appendChild(grid);
    await page.waitForChanges();

    return { page, grid };
  };

  beforeEach(() => {
    config.set('screenBreakpoints', undefined as any);
    resetScreenBreakpoints();
    resetBreakpointListeners();
  });

  afterEach(() => {
    config.set('screenBreakpoints', undefined as any);
    resetScreenBreakpoints();
    resetBreakpointListeners();
  });

  describe('screen breakpoint', () => {
    it.each([
      [320, 'xs'],
      [600, 'sm'],
      [800, 'md'],
      [1000, 'lg'],
      [1300, 'xl'],
      [1500, 'xxl'],
    ])('reflects the active breakpoint at %ipx as "%s"', async (screenWidth, expected) => {
      const { grid } = await renderGrid(screenWidth as number);

      expect(grid.getAttribute('screen-breakpoint')).toBe(expected);
    });

    it('reflects the configured widths rather than the defaults', async () => {
      // Lower sm too, so the override stays in ascending order
      config.set('screenBreakpoints', { sm: 300, md: 400 } as any);
      resetScreenBreakpoints();

      const { grid } = await renderGrid(500);

      // 500 is below the default md of 768, but at or above the configured 400
      expect(grid.getAttribute('screen-breakpoint')).toBe('md');
    });

    it('omits the attribute when no breakpoint matches', async () => {
      // xs normally matches at any width, so raise every breakpoint above the
      // viewport, keeping them in ascending order
      config.set('screenBreakpoints', { xs: 2000, sm: 2100, md: 2200, lg: 2300, xl: 2400, xxl: 2500 } as any);
      resetScreenBreakpoints();

      const { grid } = await renderGrid(100);

      expect(grid.hasAttribute('screen-breakpoint')).toBe(false);
    });

    it('re-renders with the new breakpoint when a threshold is crossed', async () => {
      const { page, grid } = await renderGrid(320);

      expect(grid.getAttribute('screen-breakpoint')).toBe('xs');

      resize(800);
      await page.waitForChanges();

      expect(grid.getAttribute('screen-breakpoint')).toBe('md');
    });

    it('stops re-rendering once the grid is disconnected', async () => {
      const { page, grid } = await renderGrid(320);

      grid.remove();
      await page.waitForChanges();

      resize(800);
      await page.waitForChanges();

      expect(grid.getAttribute('screen-breakpoint')).toBe('xs');
    });
  });

  it('applies grid-fixed only when fixed is set', async () => {
    const { page, grid } = await renderGrid(800);

    expect(grid.classList.contains('grid-fixed')).toBe(false);

    grid.fixed = true;
    forceUpdate(grid);
    await page.waitForChanges();

    expect(grid.classList.contains('grid-fixed')).toBe(true);
  });
});
