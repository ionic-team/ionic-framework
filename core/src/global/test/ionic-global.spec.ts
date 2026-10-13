const getMode = jest.fn();
const getElement = jest.fn();

jest.mock('@stencil/core', () => {
  const original = jest.requireActual('@stencil/core');
  return {
    ...original,
    getMode,
    getElement,
  };
});

/**
 * The implementation needs to be mocked before the implementation is imported.
 */
import { onBreakpointChange, resetBreakpointListeners, resetScreenBreakpoints } from '@utils/breakpoints';

import { config } from '../config';
import { getIonTheme, getIonMode, initialize } from '../ionic-global';

describe('Ionic Global', () => {
  describe('getIonMode', () => {
    const parentRef = { mode: 'md' };
    const ref = { parentElement: parentRef };

    beforeEach(() => {
      getMode.mockImplementation((ref) => ref.mode ?? parentRef.mode);

      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => parentRef.mode,
        }),
      }));
    });

    afterEach(() => {
      getMode.mockReset();
      getElement.mockReset();
    });

    it('should return the mode value of the element reference', () => {
      const ref = { mode: 'ios' };

      getMode.mockImplementation((ref) => ref.mode);

      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => ref.mode,
        }),
      }));

      expect(getIonMode(ref)).toBe('ios');
    });

    it('should return the mode value of the closest parent with a valid mode', () => {
      expect(getIonMode(ref)).toBe('md');
    });

    it('should return the default mode if the mode cannot be determined', () => {
      expect(getIonMode()).toBe('md');
    });

    it('should return the default theme if no mode is found', () => {
      const ref = { mode: undefined };
      expect(getIonMode(ref)).toBe('md');
    });
  });

  describe('getIonTheme', () => {
    const parentRef = { mode: 'md' };

    beforeEach(() => {
      getMode.mockImplementation((ref) => ref?.mode ?? parentRef.mode);

      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => parentRef.mode,
        }),
      }));
    });

    afterEach(() => {
      getMode.mockReset();
      getElement.mockReset();
    });

    it('should return the theme value of the element reference', () => {
      const ref = { mode: 'ios' };
      expect(getIonTheme(ref)).toBe('ios');
    });

    it('should return the theme value of the closest parent with a valid theme', () => {
      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => 'ios',
        }),
      }));

      expect(getIonTheme()).toBe('ios');
    });

    it('should return the default theme if it cannot be determined', () => {
      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => null,
        }),
      }));

      expect(getIonTheme()).toBe('md');
    });
  });

  describe('initialize', () => {
    const originalMatchMedia = (window as any).matchMedia;

    /** Every media query the breakpoint listeners have asked for, in order. */
    let requested: string[];

    beforeEach(() => {
      requested = [];

      (window as any).matchMedia = (media: string) => {
        requested.push(media);

        return { media, matches: false, addEventListener: () => {}, removeEventListener: () => {} };
      };

      config.set('screenBreakpoints', undefined as any);
      resetScreenBreakpoints();
      resetBreakpointListeners();
    });

    afterEach(() => {
      resetBreakpointListeners();
      resetScreenBreakpoints();
      config.set('screenBreakpoints', undefined as any);
      (window as any).matchMedia = originalMatchMedia;
    });

    /**
     * A theme can set the screen breakpoints in its own config block, which is
     * merged in after the application config, so the listeners can only be
     * rebuilt once both have been applied.
     */
    it('should rebuild the breakpoint listeners from a theme that sets the widths', () => {
      // Subscribing first is what creates the listeners there are to rebuild.
      const unsubscribe = onBreakpointChange(() => {});
      requested.length = 0;

      initialize({ customTheme: { config: { screenBreakpoints: { lg: 700 } } } } as any);

      expect(requested).toContain('(min-width: 700px)');
      expect(requested).not.toContain('(min-width: 992px)');

      unsubscribe();
    });

    /**
     * The theme's config is merged over the application's, so widths set in
     * either are kept and the listeners are built from the result.
     */
    it('should keep widths set by the application alongside those from the theme', () => {
      const unsubscribe = onBreakpointChange(() => {});
      requested.length = 0;

      initialize({
        screenBreakpoints: { sm: 300 },
        customTheme: { config: { screenBreakpoints: { lg: 700 } } },
      } as any);

      expect(requested).toContain('(min-width: 300px)');
      expect(requested).toContain('(min-width: 700px)');

      unsubscribe();
    });

    /**
     * The media queries are generated from the configured widths too, so they
     * have to be emitted once the theme's config has been merged as well.
     */
    it('should generate the breakpoint CSS from a theme that sets the widths', () => {
      initialize({ customTheme: { config: { screenBreakpoints: { lg: 700 } } } } as any);

      const injected = Array.from(document.head.querySelectorAll('style'))
        .map((style) => style.innerHTML)
        .join('')
        .replace(/\s+/g, ' ');

      expect(injected).toContain('@media (min-width: 700px) { ion-grid {');
      expect(injected).not.toContain('@media (min-width: 992px) { ion-grid {');
    });
  });
});
