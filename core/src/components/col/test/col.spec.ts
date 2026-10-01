import { config } from '@global/config';
import { forceUpdate } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { resetBreakpointListeners, resetScreenBreakpoints } from '@utils/breakpoints';
import { Col } from '../col';
import type { IonColValue } from '../col.interface';

/**
 * The default widths the assertions below are written against:
 *
 * | xs | sm  | md  | lg  | xl   | xxl  |
 * | -- | --- | --- | --- | ---- | ---- |
 * | 0  | 576 | 768 | 992 | 1200 | 1400 |
 */

describe('ion-col', () => {
  describe('class', () => {
    it('sets --internal-col-span for size="N"', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col size="3"></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      expect(col.classList.contains('col-size')).toBe(true);
      expect(col.style.getPropertyValue('--internal-col-span')).toBe('3');
    });

    it('applies col-auto for size="auto"', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col size="auto"></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      expect(col.classList.contains('col-auto')).toBe(true);
    });

    it('applies no sizing class for a valueless size attribute', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col size></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      const sizeClasses = Array.from(col.classList).filter((c) => c.startsWith('col-'));
      expect(sizeClasses).toEqual([]);
    });

    it('sets --internal-col-margin for offset="N"', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col offset="2"></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      expect(col.classList.contains('col-offset')).toBe(true);
      expect(col.style.getPropertyValue('--internal-col-margin')).toBe('2');
    });

    it('sets the order style for order="N"', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col order="5"></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      expect(col.style.order).toBe('5');
    });

    it('applies no sizing class for a non-numeric size value', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col size="banana"></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      const sizeClasses = Array.from(col.classList).filter((c) => c.startsWith('col-'));
      expect(sizeClasses).toEqual([]);
    });

    /**
     * Frameworks pass `null` for an unset binding, so clearing a value has to
     * fall back to the default flex layout instead of leaving the previous
     * inline style behind. `null` is not part of `IonColValue`, which only
     * allows it per breakpoint, hence the cast.
     */
    it('clears the sizing when size is set to null', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col size="6"></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');

      (col as any).size = null;
      forceUpdate(col);
      await page.waitForChanges();

      expect(col.classList.contains('col-size')).toBe(false);
      expect(col.style.getPropertyValue('--internal-col-span')).toBe('');
    });

    it('clears the sizing when size is set to undefined', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col size="6"></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');

      col.size = undefined;
      forceUpdate(col);
      await page.waitForChanges();

      expect(col.classList.contains('col-size')).toBe(false);
      expect(col.style.getPropertyValue('--internal-col-span')).toBe('');
    });

    it('clears the offset when it is set to null', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col offset="2"></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      expect(col.style.getPropertyValue('--internal-col-margin')).toBe('2');

      (col as any).offset = null;
      forceUpdate(col);
      await page.waitForChanges();

      expect(col.classList.contains('col-offset')).toBe(false);
      expect(col.style.getPropertyValue('--internal-col-margin')).toBe('');
    });

    it('clears the order when it is set to null', async () => {
      const page = await newSpecPage({
        components: [Col],
        html: `<ion-col order="5"></ion-col>`,
      });

      const col = page.body.querySelector('ion-col')!;
      expect(col.style.order).toBe('5');

      (col as any).order = null;
      forceUpdate(col);
      await page.waitForChanges();

      expect(col.style.order).toBe('');
    });
  });

  // TODO(FW-7557): Remove this when the push/pull props are removed.
  describe('deprecated push/pull props', () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('warns when push is set', async () => {
      await newSpecPage({
        components: [Col],
        html: `<ion-col push="3"></ion-col>`,
      });

      expect(warnSpy).toHaveBeenCalled();
      expect(warnSpy.mock.calls[0][0]).toEqual(expect.stringContaining('pull and push properties are deprecated'));
    });

    it('warns when pull is set', async () => {
      await newSpecPage({
        components: [Col],
        html: `<ion-col pull="3"></ion-col>`,
      });

      expect(warnSpy).toHaveBeenCalled();
    });

    it('warns when a breakpoint-suffixed push variant is set', async () => {
      await newSpecPage({
        components: [Col],
        html: `<ion-col push-md="3"></ion-col>`,
      });

      expect(warnSpy).toHaveBeenCalled();
    });

    it('does not warn when only non-deprecated props are set', async () => {
      await newSpecPage({
        components: [Col],
        html: `<ion-col size="3"></ion-col>`,
      });

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe('responsive properties', () => {
    let consoleWarnSpy: jest.SpyInstance;

    /**
     * Answer `window.matchMedia` as a screen of the given width would, so
     * `ion-col` resolves its responsive properties the same way it does in a
     * browser at that size.
     *
     * `newSpecPage` installs its own mock window, so this has to be applied
     * after the page is created rather than before.
     */
    const setScreenWidth = (width: number) => {
      (window as any).matchMedia = (query: string) => {
        const minWidth = query.match(/\(min-width:\s*(\d+)px\)/);

        return { matches: minWidth !== null && width >= parseInt(minWidth[1], 10) };
      };
    };

    /**
     * Render a column at the given screen width. Breakpoint objects passed
     * in `props` are applied as JavaScript properties, which is the only way
     * to set them.
     */
    const renderCol = async (screenWidth: number, html: string, props: Record<string, IonColValue> = {}) => {
      const page = await newSpecPage({ components: [Col], html });
      const col = page.body.querySelector('ion-col')!;

      setScreenWidth(screenWidth);
      Object.assign(col, props);
      forceUpdate(col);
      await page.waitForChanges();

      return col;
    };

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      config.set('screenBreakpoints', undefined as any);
      resetScreenBreakpoints();
      resetBreakpointListeners();
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
      config.set('screenBreakpoints', undefined as any);
      resetScreenBreakpoints();
      resetBreakpointListeners();
    });

    describe('with a single value', () => {
      it('applies the size at every screen width', async () => {
        const narrow = await renderCol(320, `<ion-col size="6"></ion-col>`);
        const wide = await renderCol(1600, `<ion-col size="6"></ion-col>`);

        expect(narrow.style.getPropertyValue('--internal-col-span')).toBe('6');
        expect(wide.style.getPropertyValue('--internal-col-span')).toBe('6');
      });
    });

    describe('with a breakpoint object', () => {
      it('uses the smallest breakpoint on a narrow screen', async () => {
        const col = await renderCol(320, `<ion-col></ion-col>`, { size: { xs: 12, md: 6, xxl: 3 } });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('12');
      });

      it('uses the largest matching breakpoint', async () => {
        const col = await renderCol(800, `<ion-col></ion-col>`, { size: { xs: 12, md: 6, xxl: 3 } });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');
      });

      it('supports the xxl breakpoint', async () => {
        const col = await renderCol(1440, `<ion-col></ion-col>`, { size: { xs: 12, md: 6, xxl: 3 } });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('3');
      });

      it('skips breakpoints that are not set', async () => {
        const col = await renderCol(1000, `<ion-col></ion-col>`, { size: { xs: 12, xxl: 3 } });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('12');
      });

      it('accepts values as strings', async () => {
        const col = await renderCol(800, `<ion-col></ion-col>`, { size: { xs: '12', md: '6' } });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');
      });

      it('resolves offset and order independently of size', async () => {
        const col = await renderCol(800, `<ion-col></ion-col>`, {
          size: { xs: 12, md: 6 },
          offset: { xs: 0, md: 2 },
          order: { xs: 2, md: 1 },
        });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');
        expect(col.style.getPropertyValue('--internal-col-margin')).toBe('2');
        expect(col.style.getPropertyValue('order')).toBe('1');
      });

      it('resets to the default flex layout when the value is an empty string', async () => {
        const col = await renderCol(800, `<ion-col></ion-col>`, { size: { xs: 12, md: '' } });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('');
        expect(col).not.toHaveClass('col-size');
      });

      it('resets to the default flex layout when the value is null', async () => {
        const col = await renderCol(800, `<ion-col></ion-col>`, { size: { xs: 12, md: null } as IonColValue });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('');
        expect(col).not.toHaveClass('col-size');
      });

      it('supports "auto" at a breakpoint', async () => {
        const col = await renderCol(800, `<ion-col></ion-col>`, { size: { xs: 12, md: 'auto' } });

        expect(col).toHaveClass('col-auto');
      });

      it('is not settable as an HTML attribute', async () => {
        const col = await renderCol(800, `<ion-col size='{"xs": 12, "md": 6}'></ion-col>`);

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('');
      });

      it('clears the sizing when the object is replaced with null', async () => {
        const page = await newSpecPage({ components: [Col], html: `<ion-col></ion-col>` });
        const col = page.body.querySelector('ion-col')!;

        setScreenWidth(800);
        col.size = { xs: 12, md: 6 };
        forceUpdate(col);
        await page.waitForChanges();

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');

        (col as any).size = null;
        forceUpdate(col);
        await page.waitForChanges();

        expect(col.classList.contains('col-size')).toBe(false);
        expect(col.style.getPropertyValue('--internal-col-span')).toBe('');
      });
    });

    // TODO(FW-7557): Remove this when the suffixed props are removed.
    describe('with the deprecated suffixed properties', () => {
      it('still narrows the unsuffixed value at a breakpoint', async () => {
        const col = await renderCol(800, `<ion-col size="12" size-md="6"></ion-col>`);

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');
      });

      it('falls back to the unsuffixed value below the breakpoint', async () => {
        const col = await renderCol(320, `<ion-col size="12" size-md="6"></ion-col>`);

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('12');
      });

      it('resets to the default flex layout for a value-less attribute', async () => {
        const col = await renderCol(800, `<ion-col size="12" size-md></ion-col>`);

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('');
      });

      it('warns that they are deprecated', async () => {
        await renderCol(800, `<ion-col size="12" size-md="6"></ion-col>`);

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-col] - The size-md properties are deprecated'),
          expect.anything()
        );
      });

      it('does not warn when only the unsuffixed property is set', async () => {
        await renderCol(800, `<ion-col size="12"></ion-col>`);

        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it('is ignored, with a warning, when the property is a breakpoint object', async () => {
        const col = await renderCol(800, `<ion-col size-md="6"></ion-col>`, { size: { xs: 12 } });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('12');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-col] - The size-md properties are ignored'),
          expect.anything()
        );
      });
    });

    describe('with overridden screen breakpoints', () => {
      const setScreenBreakpoints = (value: unknown) => {
        config.set('screenBreakpoints', value as any);
        resetScreenBreakpoints();
      };

      it('resolves a breakpoint object against the configured widths', async () => {
        setScreenBreakpoints({ xs: 0, sm: 200, md: 400, lg: 600, xl: 800, xxl: 1000 });

        // 500px is above the overridden md (400) but below the default md (768)
        const col = await renderCol(500, `<ion-col></ion-col>`, { size: { xs: 12, md: 6 } });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');
      });

      it('does not match a breakpoint that was moved above the screen width', async () => {
        setScreenBreakpoints({ xs: 0, sm: 900, md: 1000, lg: 1100, xl: 1200, xxl: 1400 });

        // 800px matches the default md (768) but not the overridden one
        const col = await renderCol(800, `<ion-col></ion-col>`, { size: { xs: 12, md: 6 } });

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('12');
      });

      // TODO(FW-7557): Remove this when the suffixed props are removed.
      it('applies to the deprecated suffixed properties too', async () => {
        setScreenBreakpoints({ xs: 0, sm: 200, md: 400, lg: 600, xl: 800, xxl: 1000 });

        const col = await renderCol(500, `<ion-col size="12" size-md="6"></ion-col>`);

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');
      });
    });

    /**
     * The helper above installs `matchMedia` after the page is created, so the
     * subscription in `connectedCallback` short-circuits. These install a
     * listener-capable mock first, so crossing a threshold is observable.
     */
    describe('when the screen crosses a breakpoint', () => {
      let listeners: Array<() => void>;
      let width: number;

      const installLiveMatchMedia = () => {
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

      /**
       * `newSpecPage` replaces `window.matchMedia` with its own mock, so the
       * column has to be appended after the live mock is installed for its
       * `connectedCallback` to subscribe.
       */
      const renderSubscribedCol = async () => {
        width = 320;
        const page = await newSpecPage({ components: [Col], html: `<div id="host"></div>` });

        installLiveMatchMedia();

        const col = page.doc.createElement('ion-col');
        page.body.querySelector('#host')!.appendChild(col);
        await page.waitForChanges();

        col.size = { xs: 12, md: 6 };
        forceUpdate(col);
        await page.waitForChanges();

        return { page, col };
      };

      it('re-renders with the value for the new breakpoint', async () => {
        const { page, col } = await renderSubscribedCol();

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('12');

        resize(800);
        await page.waitForChanges();

        expect(col.style.getPropertyValue('--internal-col-span')).toBe('6');
      });

      it('stops re-rendering once the column is disconnected', async () => {
        const { page, col } = await renderSubscribedCol();

        col.remove();
        await page.waitForChanges();

        resize(800);
        await page.waitForChanges();

        // still the narrow value, because the subscription was removed
        expect(col.style.getPropertyValue('--internal-col-span')).toBe('12');
      });
    });
  });
});
