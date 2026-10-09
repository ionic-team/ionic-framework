import { config } from '@global/config';

import {
  DEFAULT_SCREEN_BREAKPOINTS,
  getActiveBreakpoint,
  getScreenBreakpointMediaQuery,
  getScreenBreakpointValue,
  getScreenBreakpoints,
  isBreakpointMap,
  matchBreakpoint,
  onBreakpointChange,
  refreshBreakpointListeners,
  resetBreakpointListeners,
  resetScreenBreakpoints,
  resolveBreakpointMap,
  SCREEN_BREAKPOINT_NAMES,
  ScreenBreakpoints,
} from '../breakpoints';

/**
 * The default widths every assertion below is written against. Spelled out
 * rather than derived, so changing a default has to be a deliberate edit here
 * too.
 *
 * Viewport widths in the window tests are picked to sit inside a single band,
 * so 800 resolves to `md` because 768 <= 800 < 992.
 */
const EXPECTED_DEFAULT_SCREEN_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

describe('screen breakpoints', () => {
  let consoleWarnSpy: jest.SpyInstance;

  const setScreenBreakpoints = (value: unknown) => {
    config.set('screenBreakpoints', value as any);
    resetScreenBreakpoints();
  };

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    setScreenBreakpoints(undefined);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    setScreenBreakpoints(undefined);
  });

  describe('getScreenBreakpoints()', () => {
    /**
     * Every caller is handed the same cached object, so a write would move the
     * breakpoint for the whole page. `Readonly` only stops TypeScript callers,
     * which is why it is frozen.
     */
    it('should return a frozen object that callers cannot change', () => {
      const breakpoints = getScreenBreakpoints();

      expect(Object.isFrozen(breakpoints)).toBe(true);
      expect(() => ((breakpoints as ScreenBreakpoints).md = 600)).toThrow(TypeError);
      expect(getScreenBreakpoints().md).toBe(EXPECTED_DEFAULT_SCREEN_BREAKPOINTS.md);
    });

    it('should freeze the defaults so the fallback cannot be corrupted', () => {
      expect(Object.isFrozen(DEFAULT_SCREEN_BREAKPOINTS)).toBe(true);
    });

    it('should return the defaults when no config is set', () => {
      expect(getScreenBreakpoints()).toEqual(EXPECTED_DEFAULT_SCREEN_BREAKPOINTS);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should merge a partial override over the defaults', () => {
      setScreenBreakpoints({ md: 720, lg: 1024 });

      expect(getScreenBreakpoints()).toEqual({
        ...DEFAULT_SCREEN_BREAKPOINTS,
        md: 720,
        lg: 1024,
      });
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should accept a full override of every breakpoint', () => {
      const breakpoints = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536, xxl: 1920 };
      setScreenBreakpoints(breakpoints);

      expect(getScreenBreakpoints()).toEqual(breakpoints);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should leave the defaults untouched given a partial override', () => {
      setScreenBreakpoints({ md: 720 });
      getScreenBreakpoints();

      expect(DEFAULT_SCREEN_BREAKPOINTS).toEqual(EXPECTED_DEFAULT_SCREEN_BREAKPOINTS);
    });

    it('should leave the defaults untouched given no config at all', () => {
      setScreenBreakpoints(undefined);
      getScreenBreakpoints();

      expect(DEFAULT_SCREEN_BREAKPOINTS).toEqual(EXPECTED_DEFAULT_SCREEN_BREAKPOINTS);
    });

    it('should leave the defaults untouched given a config that is not an object', () => {
      setScreenBreakpoints('nonsense');
      getScreenBreakpoints();

      expect(DEFAULT_SCREEN_BREAKPOINTS).toEqual(EXPECTED_DEFAULT_SCREEN_BREAKPOINTS);
    });

    it('should cache the resolved breakpoints so warnings are only printed once', () => {
      setScreenBreakpoints({ md: '768px' });

      getScreenBreakpoints();
      getScreenBreakpoints();
      getScreenBreakpoints();

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });

    it('should re-resolve when the config object is replaced', () => {
      config.set('screenBreakpoints', { md: 700 } as any);
      expect(getScreenBreakpoints().md).toBe(700);

      config.set('screenBreakpoints', { md: 800 } as any);
      expect(getScreenBreakpoints().md).toBe(800);
    });

    it('should not re-resolve when the existing config object is mutated in place', () => {
      const screenBreakpoints = { md: 700 };
      config.set('screenBreakpoints', screenBreakpoints as any);
      expect(getScreenBreakpoints().md).toBe(700);

      screenBreakpoints.md = 800;

      expect(getScreenBreakpoints().md).toBe(700);
    });

    describe('with an invalid value for a breakpoint', () => {
      it.each([
        ['a CSS length', '768px'],
        ['a numeric string', '768'],
        ['a media query', '(min-width: 768px)'],
        ['a negative number', -1],
        ['NaN', NaN],
        ['Infinity', Infinity],
        ['null', null],
        ['a boolean', true],
      ])('should fall back to the default when the value is %s', (_description, value) => {
        setScreenBreakpoints({ md: value });

        expect(getScreenBreakpoints().md).toBe(DEFAULT_SCREEN_BREAKPOINTS.md);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid value for the "md" screen breakpoint')
        );
      });

      it('should keep the other valid overrides', () => {
        setScreenBreakpoints({ md: '768px', lg: 1024 });

        expect(getScreenBreakpoints()).toEqual({
          ...DEFAULT_SCREEN_BREAKPOINTS,
          lg: 1024,
        });
      });
    });

    describe('with an unknown breakpoint name', () => {
      it('should ignore the name and warns that breakpoints cannot be renamed', () => {
        setScreenBreakpoints({ small: 500, xxxl: 2000 });

        expect(getScreenBreakpoints()).toEqual(DEFAULT_SCREEN_BREAKPOINTS);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            'Unknown screen breakpoint name(s) in the "screenBreakpoints" config: "small", "xxxl"'
          )
        );
      });
    });

    describe('with a non-object config', () => {
      it.each([
        ['a string', '768px'],
        ['a number', 768],
        ['an array', [0, 576, 768]],
        ['null', null],
      ])('should fall back to the defaults when the config is %s', (_description, value) => {
        setScreenBreakpoints(value);

        expect(getScreenBreakpoints()).toEqual(DEFAULT_SCREEN_BREAKPOINTS);
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid "screenBreakpoints" config'));
      });
    });

    describe('with breakpoints that are not in ascending order', () => {
      it('should use the provided values but warns', () => {
        setScreenBreakpoints({ md: 1000 });

        expect(getScreenBreakpoints().md).toBe(1000);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('The "screenBreakpoints" config is not in ascending order')
        );
      });

      it('should not warn when adjacent breakpoints are equal', () => {
        setScreenBreakpoints({ md: 576 });

        expect(getScreenBreakpoints().md).toBe(576);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('getScreenBreakpointValue()', () => {
    it('should return the width the breakpoint activates at', () => {
      expect(getScreenBreakpointValue('lg')).toBe(992);
    });

    it('should reflect an override', () => {
      setScreenBreakpoints({ lg: 1024 });

      expect(getScreenBreakpointValue('lg')).toBe(1024);
    });

    it.each([['xxxl'], [''], [undefined], [null], [0]])('should return undefined for %p', (value) => {
      expect(getScreenBreakpointValue(value)).toBeUndefined();
    });
  });

  describe('getScreenBreakpointMediaQuery()', () => {
    it('should build a min-width query from the breakpoint width', () => {
      expect(getScreenBreakpointMediaQuery('md')).toBe('(min-width: 768px)');
    });

    it('should reflect an override', () => {
      setScreenBreakpoints({ md: 720 });

      expect(getScreenBreakpointMediaQuery('md')).toBe('(min-width: 720px)');
    });

    it('should return undefined when the name is not a screen breakpoint', () => {
      expect(getScreenBreakpointMediaQuery('xxxl')).toBeUndefined();
    });
  });

  describe('isBreakpointMap()', () => {
    it('should return true for an object', () => {
      expect(isBreakpointMap({ xs: 12, md: 6 })).toBe(true);
    });

    it('should return true for an empty object', () => {
      expect(isBreakpointMap({})).toBe(true);
    });

    it.each([
      ['a plain string', '12'],
      ['the "auto" keyword', 'auto'],
      ['an empty string', ''],
      ['a JSON object string', '{"xs": 12}'],
      ['a number', 12],
      ['undefined', undefined],
      ['null', null],
      ['an array', [1, 2]],
    ])('should return false for %s', (_description, value) => {
      expect(isBreakpointMap(value)).toBe(false);
    });
  });

  describe('resolveBreakpointMap()', () => {
    it('should return the value for the largest matching breakpoint', () => {
      const resolved = resolveBreakpointMap({ xs: 12, md: 6, xl: 3 }, (bp) => ['xs', 'sm', 'md'].includes(bp));

      expect(resolved).toBe(6);
    });

    it('should skip breakpoints with no value set', () => {
      const resolved = resolveBreakpointMap({ xs: 12, xxl: 1 }, () => true);

      expect(resolved).toBe(1);
    });

    it('should return undefined when no breakpoint matches', () => {
      expect(resolveBreakpointMap({ lg: 4 }, () => false)).toBeUndefined();
    });

    it('should return undefined for an empty map', () => {
      expect(resolveBreakpointMap({}, () => true)).toBeUndefined();
    });

    it('should resolve regardless of the order the keys were written in', () => {
      const resolved = resolveBreakpointMap({ xl: 3, xs: 12, md: 6 }, () => true);

      expect(resolved).toBe(3);
    });
  });
});

/**
 * A minimal `MediaQueryList` stand-in. Only `(min-width: Npx)` is understood,
 * which is the only form the breakpoints build.
 */
interface MockQuery {
  media: string;
  minWidth: number;
  matches: boolean;
  listeners: Set<() => void>;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

describe('screen breakpoints against the window', () => {
  const originalMatchMedia = (window as any).matchMedia;

  let queries: MockQuery[];
  let width: number;

  /** Set the viewport width, firing `change` on the queries whose result flipped. */
  const setWidth = (next: number) => {
    const before = queries.map((query) => query.matches);
    width = next;

    queries.forEach((query, i) => {
      query.matches = width >= query.minWidth;

      if (query.matches !== before[i]) {
        query.listeners.forEach((listener) => listener());
      }
    });
  };

  beforeEach(() => {
    queries = [];
    width = 1024;

    (window as any).matchMedia = (media: string) => {
      const minWidth = Number(/\(min-width:\s*(\d+)px\)/.exec(media)?.[1] ?? NaN);
      const query: MockQuery = {
        media,
        minWidth,
        matches: Number.isFinite(minWidth) && width >= minWidth,
        listeners: new Set(),
        addEventListener: (_type, listener) => query.listeners.add(listener),
        removeEventListener: (_type, listener) => query.listeners.delete(listener),
      };

      queries.push(query);
      return query;
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

  describe('matchBreakpoint()', () => {
    it.each([[undefined], ['']])('should always match for %p, so unqualified values apply everywhere', (value) => {
      expect(matchBreakpoint(value)).toBe(true);
    });

    it('should match a breakpoint at or below the current width', () => {
      setWidth(800);

      expect(matchBreakpoint('xs')).toBe(true);
      expect(matchBreakpoint('md')).toBe(true);
    });

    it('should not match a breakpoint above the current width', () => {
      setWidth(800);

      expect(matchBreakpoint('lg')).toBe(false);
      expect(matchBreakpoint('xxl')).toBe(false);
    });

    it('should not match a name that is not a screen breakpoint', () => {
      expect(matchBreakpoint('xxxl')).toBe(false);
    });

    it('should reflect the configured widths rather than the defaults', () => {
      config.set('screenBreakpoints', { md: 400 } as any);
      resetScreenBreakpoints();
      setWidth(500);

      // 500 is below the default md of 768, but above the configured 400
      expect(matchBreakpoint('md')).toBe(true);
    });

    it('should not match when matchMedia is unavailable', () => {
      (window as any).matchMedia = undefined;

      expect(matchBreakpoint('md')).toBe(false);
    });
  });

  describe('getActiveBreakpoint()', () => {
    it.each([
      [500, 'xs'],
      [576, 'sm'],
      [800, 'md'],
      [1000, 'lg'],
      [1300, 'xl'],
      [1500, 'xxl'],
    ])('should return %p -> %p', (viewport, expected) => {
      setWidth(viewport);

      expect(getActiveBreakpoint()).toBe(expected);
    });

    it('should return undefined when no breakpoint matches', () => {
      // xs normally matches at any width, so raise it above the viewport too
      config.set('screenBreakpoints', { xs: 2000 } as any);
      resetScreenBreakpoints();
      setWidth(100);

      expect(getActiveBreakpoint()).toBeUndefined();
    });

    it('should reflect the configured widths', () => {
      config.set('screenBreakpoints', { xxl: 900 } as any);
      resetScreenBreakpoints();
      setWidth(1000);

      expect(getActiveBreakpoint()).toBe('xxl');
    });
  });

  describe('onBreakpointChange()', () => {
    it('should notify the subscriber when a threshold is crossed', () => {
      const callback = jest.fn();
      onBreakpointChange(callback);

      setWidth(500);

      expect(callback).toHaveBeenCalled();
    });

    it('should not notify when the width changes without crossing a threshold', () => {
      const callback = jest.fn();
      onBreakpointChange(callback);

      // 1024 and 1100 are both between lg (992) and xl (1200)
      setWidth(1100);

      expect(callback).not.toHaveBeenCalled();
    });

    /**
     * The queries are built from the configured widths when the first
     * subscriber arrives, which is the supported order: the config is in place
     * before any component connects. 700 and 730 sit between the default sm
     * (576) and md (768), so this only fires if the configured md is used.
     */
    it('should notify at the configured width rather than the default', () => {
      config.set('screenBreakpoints', { md: 720 } as any);

      const callback = jest.fn();
      onBreakpointChange(callback);

      setWidth(700);
      callback.mockClear();

      setWidth(730);

      expect(callback).toHaveBeenCalled();
    });

    /**
     * The queries are built on first subscribe, so a later config reset has to
     * rebuild them. 700 and 730 both sit between the default sm (576) and md
     * (768), so this only fires if the rebuilt queries use the configured md.
     */
    it('should notify at the new width after the config is reset', () => {
      const callback = jest.fn();
      onBreakpointChange(callback);

      setWidth(700);

      config.set('screenBreakpoints', { md: 720 } as any);
      refreshBreakpointListeners();
      callback.mockClear();

      setWidth(730);

      expect(callback).toHaveBeenCalled();
    });

    it('should notify once when the listeners are rebuilt, so subscribers re-resolve', () => {
      const callback = jest.fn();
      onBreakpointChange(callback);

      config.set('screenBreakpoints', { md: 720 } as any);
      refreshBreakpointListeners();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when nothing has subscribed', () => {
      expect(() => refreshBreakpointListeners()).not.toThrow();
    });

    it('should notify every subscriber', () => {
      const first = jest.fn();
      const second = jest.fn();
      onBreakpointChange(first);
      onBreakpointChange(second);

      setWidth(500);

      expect(first).toHaveBeenCalled();
      expect(second).toHaveBeenCalled();
    });

    it('should stop notifying after the returned function is called', () => {
      const callback = jest.fn();
      const unsubscribe = onBreakpointChange(callback);

      unsubscribe();
      setWidth(500);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should keep notifying the remaining subscribers after one unsubscribes', () => {
      const staying = jest.fn();
      const leaving = jest.fn();
      onBreakpointChange(staying);
      onBreakpointChange(leaving)();

      setWidth(500);

      expect(staying).toHaveBeenCalled();
      expect(leaving).not.toHaveBeenCalled();
    });

    it('should create one media query per breakpoint however many subscribers there are', () => {
      onBreakpointChange(jest.fn());
      onBreakpointChange(jest.fn());
      onBreakpointChange(jest.fn());

      expect(queries).toHaveLength(SCREEN_BREAKPOINT_NAMES.length);
    });

    it('should survive unsubscribing after the listeners have been torn down', () => {
      const unsubscribe = onBreakpointChange(jest.fn());

      resetBreakpointListeners();

      // A component disconnecting after teardown still calls its unsubscribe
      expect(() => unsubscribe()).not.toThrow();
    });

    it('should return a callable no-op when matchMedia is unavailable', () => {
      (window as any).matchMedia = undefined;
      const callback = jest.fn();

      const unsubscribe = onBreakpointChange(callback);

      expect(() => unsubscribe()).not.toThrow();
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
