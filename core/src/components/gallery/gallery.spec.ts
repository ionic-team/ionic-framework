import { newSpecPage } from '@stencil/core/testing';
import * as helpers from '@utils/helpers';
import * as logging from '@utils/logging';

import { Gallery } from './gallery';
import { DEFAULT_COLUMNS, DEFAULT_GAP } from './gallery-constants';

let sharedGallery: Gallery;
let el: HTMLIonGalleryElement;

// The expected columns and gap for each breakpoint when the columns and gap
// properties are not set or are set to an invalid value.
const DEFAULT_BREAKPOINTS = [
  // xs
  { width: 0, expectedColumns: DEFAULT_COLUMNS['xs'], expectedGap: DEFAULT_GAP },
  { width: 575, expectedColumns: DEFAULT_COLUMNS['xs'], expectedGap: DEFAULT_GAP },
  // sm
  { width: 576, expectedColumns: DEFAULT_COLUMNS['sm'], expectedGap: DEFAULT_GAP },
  { width: 767, expectedColumns: DEFAULT_COLUMNS['sm'], expectedGap: DEFAULT_GAP },
  // md
  { width: 768, expectedColumns: DEFAULT_COLUMNS['md'], expectedGap: DEFAULT_GAP },
  { width: 991, expectedColumns: DEFAULT_COLUMNS['md'], expectedGap: DEFAULT_GAP },
  // lg
  { width: 992, expectedColumns: DEFAULT_COLUMNS['lg'], expectedGap: DEFAULT_GAP },
  { width: 1199, expectedColumns: DEFAULT_COLUMNS['lg'], expectedGap: DEFAULT_GAP },
  // xl
  { width: 1200, expectedColumns: DEFAULT_COLUMNS['xl'], expectedGap: DEFAULT_GAP },
  { width: 1399, expectedColumns: DEFAULT_COLUMNS['xl'], expectedGap: DEFAULT_GAP },
  // xxl
  { width: 1400, expectedColumns: DEFAULT_COLUMNS['xxl'], expectedGap: DEFAULT_GAP },
];

describe('gallery', () => {
  beforeEach(() => {
    sharedGallery = new Gallery();
    el = document.createElement('ion-gallery');
    Object.defineProperty(sharedGallery, 'el', {
      value: el,
      configurable: true,
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('gallery: columns', () => {
    describe('onColumnsOrGapChanged()', () => {
      it('should call syncResponsiveLayout when columns or gap change', () => {
        const syncResponsiveLayoutSpy = jest.spyOn(sharedGallery as any, 'syncResponsiveLayout');
        const warnUnusedOrderSpy = jest.spyOn(sharedGallery as any, 'warnUnusedOrder');

        (sharedGallery as any).onColumnsOrGapChanged();

        expect(syncResponsiveLayoutSpy).toHaveBeenCalledTimes(1);
        expect(warnUnusedOrderSpy).not.toHaveBeenCalled();

        syncResponsiveLayoutSpy.mockRestore();
        warnUnusedOrderSpy.mockRestore();
      });
    });

    describe('sanitizeColumns()', () => {
      it('should return undefined for invalid values', () => {
        const invalidValues = [undefined, NaN, Infinity, '0', '-1', '0.5', 'invalid', '', '   ', 0, -1, 0.5];
        invalidValues.forEach((value) => {
          expect((sharedGallery as any).sanitizeColumns(value)).toBeUndefined();
        });
      });

      it('should return the number for positive integers', () => {
        expect((sharedGallery as any).sanitizeColumns(1)).toBe(1);
        expect((sharedGallery as any).sanitizeColumns('1')).toBe(1);
        expect((sharedGallery as any).sanitizeColumns(10)).toBe(10);
        expect((sharedGallery as any).sanitizeColumns('10')).toBe(10);
      });
    });

    describe('getColumnsForWidth()', () => {
      it('should resolve to the default columns for each breakpoint', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });
      });

      it('should fallback to the default columns when the columns property is set to a negative integer', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.columns = -3;

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "columns" value (-3).'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should fallback to the default columns when the columns property is set to zero', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.columns = 0;

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "columns" value (0).'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should fallback to the default columns when the columns property is set to an invalid string', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.columns = 'invalid';

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "columns" value ("invalid").'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should fallback to the default columns when the columns property is set to an object with all invalid breakpoint values', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.columns = { xs: 'invalid', sm: -3 };

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });

        expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('[ion-gallery] - Invalid "columns" value'), el);

        warningSpy.mockRestore();
      });

      it('should warn and fallback when columns is an empty breakpoint map object', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.columns = {} as any;

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "columns" value ({})'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should warn and fallback when columns breakpoint map has only unrecognized keys', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.columns = { colums: 4, sm_typo: 3 } as any;

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });

        expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('[ion-gallery] - Invalid "columns" value'), el);

        warningSpy.mockRestore();
      });

      it('should properly set columns for the md breakpoint but fallback to the default columns for all others when the columns property is set to an object with one valid breakpoint and the rest invalid', () => {
        const breakpoints = [
          // xs
          { width: 0, expectedColumns: DEFAULT_COLUMNS['xs'] },
          { width: 575, expectedColumns: DEFAULT_COLUMNS['xs'] },
          // sm
          { width: 576, expectedColumns: DEFAULT_COLUMNS['sm'] },
          { width: 767, expectedColumns: DEFAULT_COLUMNS['sm'] },
          // md
          { width: 768, expectedColumns: 5 },
          { width: 991, expectedColumns: 5 },
          // lg
          { width: 992, expectedColumns: DEFAULT_COLUMNS['lg'] },
          { width: 1199, expectedColumns: DEFAULT_COLUMNS['lg'] },
          // xl
          { width: 1200, expectedColumns: DEFAULT_COLUMNS['xl'] },
          { width: 1399, expectedColumns: DEFAULT_COLUMNS['xl'] },
          // xxl
          { width: 1400, expectedColumns: DEFAULT_COLUMNS['xxl'] },
        ];

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.columns = { xs: 'invalid', sm: -3, md: 5, lg: 'foo', xl: 'bar', xxl: 'baz' };

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });

        expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('[ion-gallery] - Invalid "columns" value'), el);

        warningSpy.mockRestore();
      });

      it('should fallback to the default columns when the columns property is set to an unaccepted type', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.columns = [{ xs: 2 }] as any;

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "columns" value ([{"xs":2}]).'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should resolve to 2 columns when the columns property is set to a number', () => {
        const breakpoints = [
          // xs
          { width: 0, expectedColumns: 2 },
          { width: 575, expectedColumns: 2 },
          // sm
          { width: 576, expectedColumns: 2 },
          { width: 767, expectedColumns: 2 },
          // md
          { width: 768, expectedColumns: 2 },
          { width: 991, expectedColumns: 2 },
          // lg
          { width: 992, expectedColumns: 2 },
          { width: 1199, expectedColumns: 2 },
          // xl
          { width: 1200, expectedColumns: 2 },
          { width: 1399, expectedColumns: 2 },
          // xxl
          { width: 1400, expectedColumns: 2 },
        ];

        sharedGallery.columns = 2;

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });
      });

      it('should resolve to 3 columns when the columns property is set to a string', () => {
        const breakpoints = [
          // xs
          { width: 0, expectedColumns: 3 },
          { width: 575, expectedColumns: 3 },
          // sm
          { width: 576, expectedColumns: 3 },
          { width: 767, expectedColumns: 3 },
          // md
          { width: 768, expectedColumns: 3 },
          { width: 991, expectedColumns: 3 },
          // lg
          { width: 992, expectedColumns: 3 },
          { width: 1199, expectedColumns: 3 },
          // xl
          { width: 1200, expectedColumns: 3 },
          { width: 1399, expectedColumns: 3 },
          // xxl
          { width: 1400, expectedColumns: 3 },
        ];

        sharedGallery.columns = '3';

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });
      });

      it('should resolve to the proper columns when the columns property is set to an object', () => {
        const breakpoints = [
          // xs
          { width: 0, expectedColumns: 3 },
          { width: 575, expectedColumns: 3 },
          // sm
          { width: 576, expectedColumns: 4 },
          { width: 767, expectedColumns: 4 },
          // md
          { width: 768, expectedColumns: 5 },
          { width: 991, expectedColumns: 5 },
          // lg
          { width: 992, expectedColumns: 7 },
          { width: 1199, expectedColumns: 7 },
          // xl
          { width: 1200, expectedColumns: 9 },
          { width: 1399, expectedColumns: 9 },
          // xxl
          { width: 1400, expectedColumns: 12 },
        ];

        sharedGallery.columns = { xs: 3, sm: 4, md: 5, lg: 7, xl: 9, xxl: 12 };

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });
      });

      it('should resolve to the proper columns when the columns property is set to an out of order object', () => {
        const breakpoints = [
          // xs
          { width: 0, expectedColumns: 3 },
          { width: 575, expectedColumns: 3 },
          // sm
          { width: 576, expectedColumns: 4 },
          { width: 767, expectedColumns: 4 },
          // md
          { width: 768, expectedColumns: 5 },
          { width: 991, expectedColumns: 5 },
          // lg
          { width: 992, expectedColumns: 7 },
          { width: 1199, expectedColumns: 7 },
          // xl
          { width: 1200, expectedColumns: 9 },
          { width: 1399, expectedColumns: 9 },
          // xxl
          { width: 1400, expectedColumns: 12 },
        ];

        sharedGallery.columns = { xxl: 12, xl: 9, lg: 7, md: 5, sm: 4, xs: 3 };

        breakpoints.forEach(({ width, expectedColumns }) => {
          expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
        });
      });
    });
  });

  describe('gallery: gap', () => {
    describe('sanitizeGap()', () => {
      it('should return undefined for invalid values', () => {
        const invalidValues = [undefined, NaN, Infinity, '-1', 'px.5', 'vw10', 'invalid', '', '   ', -1];
        invalidValues.forEach((value) => {
          expect((sharedGallery as any).sanitizeGap(value)).toBeUndefined();
        });
      });

      // The gap property only accepts a single value
      it('should return undefined for space-separated values', () => {
        expect((sharedGallery as any).sanitizeGap('10px 20px')).toBeUndefined();
        expect((sharedGallery as any).sanitizeGap('10px 20px 30px')).toBeUndefined();
        expect((sharedGallery as any).sanitizeGap('10px 20px 30px 40px')).toBeUndefined();
      });

      // The gap property does not support CSS keyword values
      it('should return undefined for global CSS keywords', () => {
        expect((sharedGallery as any).sanitizeGap('inherit')).toBeUndefined();
        expect((sharedGallery as any).sanitizeGap('initial')).toBeUndefined();
        expect((sharedGallery as any).sanitizeGap('revert')).toBeUndefined();
        expect((sharedGallery as any).sanitizeGap('revert-layer')).toBeUndefined();
        expect((sharedGallery as any).sanitizeGap('unset')).toBeUndefined();
        expect((sharedGallery as any).sanitizeGap('normal')).toBeUndefined();
        expect((sharedGallery as any).sanitizeGap('auto')).toBeUndefined();
      });

      it('should return the string for CSS math functions', () => {
        expect((sharedGallery as any).sanitizeGap('calc(10% + 20px)')).toBe('calc(10% + 20px)');
        expect((sharedGallery as any).sanitizeGap('min(10px, 20%)')).toBe('min(10px, 20%)');
        expect((sharedGallery as any).sanitizeGap('max(10px, 20%)')).toBe('max(10px, 20%)');
        expect((sharedGallery as any).sanitizeGap('clamp(10px, 20%, 30px)')).toBe('clamp(10px, 20%, 30px)');
      });

      it('should return undefined for malformed math functions', () => {
        const malformedValues = ['calc', 'calc(', 'calc()', 'min(', 'clamp(', 'calc(10px + 20px'];
        malformedValues.forEach((value) => {
          expect((sharedGallery as any).sanitizeGap(value)).toBeUndefined();
        });
      });

      it('should return the string for CSS variables', () => {
        expect((sharedGallery as any).sanitizeGap('var(--app-gap)')).toBe('var(--app-gap)');
        expect((sharedGallery as any).sanitizeGap('var(--app-gap, 16px)')).toBe('var(--app-gap, 16px)');
        expect((sharedGallery as any).sanitizeGap('  var(--app-gap)  ')).toBe('var(--app-gap)');
      });

      it('should return undefined for malformed CSS variables', () => {
        const malformedValues = ['var(--app-gap. 16px)', 'var(--app-gap', 'var()', 'var(16px)'];
        malformedValues.forEach((value) => {
          expect((sharedGallery as any).sanitizeGap(value)).toBeUndefined();
        });
      });

      it('should return the px value for positive integers', () => {
        expect((sharedGallery as any).sanitizeGap(0)).toBe('0px');
        expect((sharedGallery as any).sanitizeGap('0')).toBe('0px');

        expect((sharedGallery as any).sanitizeGap(1)).toBe('1px');
        expect((sharedGallery as any).sanitizeGap('1')).toBe('1px');

        expect((sharedGallery as any).sanitizeGap(10)).toBe('10px');
        expect((sharedGallery as any).sanitizeGap('10')).toBe('10px');
      });

      it('should return the px value for fractional integers', () => {
        expect((sharedGallery as any).sanitizeGap(0.5)).toBe('0.5px');
        expect((sharedGallery as any).sanitizeGap('0.5')).toBe('0.5px');

        expect((sharedGallery as any).sanitizeGap(1.5)).toBe('1.5px');
        expect((sharedGallery as any).sanitizeGap('1.5')).toBe('1.5px');

        expect((sharedGallery as any).sanitizeGap(10.55)).toBe('10.55px');
        expect((sharedGallery as any).sanitizeGap('10.55')).toBe('10.55px');
      });

      it('should return the string for CSS length strings', () => {
        expect((sharedGallery as any).sanitizeGap('16px')).toBe('16px');
        expect((sharedGallery as any).sanitizeGap('1rem')).toBe('1rem');
        expect((sharedGallery as any).sanitizeGap('24px')).toBe('24px');
        expect((sharedGallery as any).sanitizeGap('5vh')).toBe('5vh');
        expect((sharedGallery as any).sanitizeGap('2vw')).toBe('2vw');
        expect((sharedGallery as any).sanitizeGap('12.5%')).toBe('12.5%');
        expect((sharedGallery as any).sanitizeGap('3cqw')).toBe('3cqw');
      });
    });

    describe('getGapForWidth()', () => {
      it('should resolve to the default gap for each breakpoint', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });
      });

      it('should fallback to the default gap when the gap property is set to a negative number', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = -3;

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "gap" value (-3).'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should fallback to the default gap when the gap property is set to an invalid string', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = '';

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "gap" value ("").'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should fallback to the default gap when the gap property is set to an object with all invalid breakpoint values', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = { xs: '', sm: -3 };

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('[ion-gallery] - Invalid "gap" value'), el);

        warningSpy.mockRestore();
      });

      it('should warn and fallback when gap is an empty breakpoint map object', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = {} as any;

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "gap" value ({})'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should warn and fallback when gap breakpoint map has only unrecognized keys', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = { gapp: '8px', sm_typo: '1rem' } as any;

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('[ion-gallery] - Invalid "gap" value'), el);

        warningSpy.mockRestore();
      });

      it('should properly set gap for the md breakpoint but fallback to the default gap for all others when the gap property is set to an object with one valid breakpoint and the rest invalid', () => {
        const breakpoints = [
          { width: 0, expectedGap: DEFAULT_GAP },
          { width: 575, expectedGap: DEFAULT_GAP },
          { width: 576, expectedGap: DEFAULT_GAP },
          { width: 767, expectedGap: DEFAULT_GAP },
          { width: 768, expectedGap: '1rem' },
          { width: 991, expectedGap: '1rem' },
          { width: 992, expectedGap: DEFAULT_GAP },
          { width: 1199, expectedGap: DEFAULT_GAP },
          { width: 1200, expectedGap: DEFAULT_GAP },
          { width: 1399, expectedGap: DEFAULT_GAP },
          { width: 1400, expectedGap: DEFAULT_GAP },
        ];
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = { xs: '', sm: -3, md: '1rem', lg: '   ', xl: '', xxl: -1 };

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('[ion-gallery] - Invalid "gap" value'), el);

        warningSpy.mockRestore();
      });

      it('should fallback to the default gap when the gap property is set to an unaccepted type', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = [{ xs: 'invalid' }] as any;

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "gap" value ([{"xs":"invalid"}]).'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should resolve to 16px when the gap property is set to a number', () => {
        const breakpoints = DEFAULT_BREAKPOINTS.map(({ width }) => ({ width, expectedGap: '16px' }));

        sharedGallery.gap = 16;

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });
      });

      it('should resolve to 12px when the gap property is set to a numeric string', () => {
        const breakpoints = DEFAULT_BREAKPOINTS.map(({ width }) => ({ width, expectedGap: '12px' }));

        sharedGallery.gap = '12';

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });
      });

      it('should resolve to 1rem when the gap property is set to a CSS length string', () => {
        const breakpoints = DEFAULT_BREAKPOINTS.map(({ width }) => ({ width, expectedGap: '1rem' }));

        sharedGallery.gap = '1rem';

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });
      });

      it('should resolve to the proper gap when the gap property is set to an object', () => {
        const breakpoints = [
          { width: 0, expectedGap: '8px' },
          { width: 575, expectedGap: '8px' },
          { width: 576, expectedGap: '.5rem' },
          { width: 767, expectedGap: '.5rem' },
          { width: 768, expectedGap: '1rem' },
          { width: 991, expectedGap: '1rem' },
          { width: 992, expectedGap: '24px' },
          { width: 1199, expectedGap: '24px' },
          { width: 1200, expectedGap: '5vh' },
          { width: 1399, expectedGap: '5vh' },
          { width: 1400, expectedGap: '2vw' },
        ];

        sharedGallery.gap = { xs: 8, sm: '.5rem', md: '1rem', lg: '24px', xl: '5vh', xxl: '2vw' };

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });
      });

      it('should resolve to the CSS variable for each breakpoint without warning when gap is a CSS variable', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = 'var(--app-gap)';

        breakpoints.forEach(({ width }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe('var(--app-gap)');
        });

        expect(warningSpy).not.toHaveBeenCalled();

        warningSpy.mockRestore();
      });

      it('should resolve to the CSS variable for breakpoints that set one when gap is a breakpoint map', () => {
        const breakpoints = [
          { width: 0, expectedGap: DEFAULT_GAP },
          { width: 575, expectedGap: DEFAULT_GAP },
          { width: 576, expectedGap: DEFAULT_GAP },
          { width: 767, expectedGap: DEFAULT_GAP },
          { width: 768, expectedGap: 'var(--app-gap)' },
          { width: 991, expectedGap: 'var(--app-gap)' },
          { width: 992, expectedGap: DEFAULT_GAP },
          { width: 1199, expectedGap: DEFAULT_GAP },
          { width: 1200, expectedGap: DEFAULT_GAP },
          { width: 1399, expectedGap: DEFAULT_GAP },
          { width: 1400, expectedGap: DEFAULT_GAP },
        ];
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = { md: 'var(--app-gap)' };

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).not.toHaveBeenCalled();

        warningSpy.mockRestore();
      });

      it('should resolve a breakpoint map mixing CSS variables, literals, and unset (default) breakpoints', () => {
        const breakpoints = [
          { width: 0, expectedGap: '8px' },
          { width: 575, expectedGap: '8px' },
          { width: 576, expectedGap: 'var(--g-sm)' },
          { width: 767, expectedGap: 'var(--g-sm)' },
          { width: 768, expectedGap: 'var(--g-md)' },
          { width: 991, expectedGap: 'var(--g-md)' },
          { width: 992, expectedGap: DEFAULT_GAP },
          { width: 1199, expectedGap: DEFAULT_GAP },
          { width: 1200, expectedGap: '2rem' },
          { width: 1399, expectedGap: '2rem' },
          { width: 1400, expectedGap: DEFAULT_GAP },
        ];
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = { xs: '8px', sm: 'var(--g-sm)', md: 'var(--g-md)', xl: '2rem' };

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).not.toHaveBeenCalled();

        warningSpy.mockRestore();
      });

      it('should warn and fallback to the default gap when gap is a malformed CSS variable', () => {
        const breakpoints = DEFAULT_BREAKPOINTS;
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        sharedGallery.gap = 'var(--app-gap. 16px)';

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Invalid "gap" value ("var(--app-gap. 16px)").'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should resolve to the proper gap when the gap property is set to an out of order object', () => {
        const breakpoints = [
          { width: 0, expectedGap: '8px' },
          { width: 575, expectedGap: '8px' },
          { width: 576, expectedGap: '.5rem' },
          { width: 767, expectedGap: '.5rem' },
          { width: 768, expectedGap: '1rem' },
          { width: 991, expectedGap: '1rem' },
          { width: 992, expectedGap: '24px' },
          { width: 1199, expectedGap: '24px' },
          { width: 1200, expectedGap: '5vh' },
          { width: 1399, expectedGap: '5vh' },
          { width: 1400, expectedGap: '2vw' },
        ];

        sharedGallery.gap = { xxl: '2vw', xl: '5vh', lg: '24px', md: '1rem', sm: '.5rem', xs: 8 };

        breakpoints.forEach(({ width, expectedGap }) => {
          expect((sharedGallery as any).getGapForWidth(width)).toBe(expectedGap);
        });
      });
    });
  });

  describe('gallery: layout', () => {
    describe('getItems()', () => {
      it('should collect direct ion-gallery-item children as items', () => {
        const itemOne = document.createElement('ion-gallery-item');
        const itemTwo = document.createElement('ion-gallery-item');
        el.appendChild(itemOne);
        el.appendChild(itemTwo);

        const items = (sharedGallery as any).getItems();

        expect(items).toEqual([itemOne, itemTwo]);
      });

      it('should flatten a wrapper element and collapse its box with display: contents', () => {
        const wrapper = document.createElement('div');
        const itemOne = document.createElement('ion-gallery-item');
        const itemTwo = document.createElement('ion-gallery-item');
        wrapper.appendChild(itemOne);
        wrapper.appendChild(itemTwo);
        el.appendChild(wrapper);

        const items = (sharedGallery as any).getItems();

        expect(items).toEqual([itemOne, itemTwo]);
        expect(wrapper.style.display).toBe('contents');
      });

      it('should clear display: contents on a wrapper when it no longer contains items', () => {
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        const wrapper = document.createElement('div');
        const item = document.createElement('ion-gallery-item');
        wrapper.appendChild(item);
        el.appendChild(wrapper);

        // Wrapper is initially collapsed with display: contents.
        (sharedGallery as any).getItems();
        expect(wrapper.style.display).toBe('contents');

        // Remove the item, leaving the wrapper empty.
        wrapper.removeChild(item);

        // Verify that the wrapper has no items, is no longer collapsed and
        // a warning is issued about the invalid child element.
        const items = (sharedGallery as any).getItems();
        expect(items).toEqual([]);
        expect(wrapper.style.display).toBe('');

        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Gallery items must be wrapped in "ion-gallery-item" components.'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should warn and ignore children that do not contain an ion-gallery-item', () => {
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        el.appendChild(document.createElement('img'));

        const items = (sharedGallery as any).getItems();

        expect(items).toEqual([]);
        expect(warningSpy).toHaveBeenCalledWith(
          expect.stringContaining('[ion-gallery] - Gallery items must be wrapped in "ion-gallery-item" components.'),
          el
        );

        warningSpy.mockRestore();
      });

      it('should only warn once about invalid children', () => {
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        el.appendChild(document.createElement('img'));
        el.appendChild(document.createElement('span'));

        (sharedGallery as any).getItems();
        (sharedGallery as any).getItems();

        expect(warningSpy).toHaveBeenCalledTimes(1);

        warningSpy.mockRestore();
      });

      it('should apply masonry grid placement styles to items', () => {
        const itemOne = document.createElement('ion-gallery-item');
        const itemTwo = document.createElement('ion-gallery-item');
        el.appendChild(itemOne);
        el.appendChild(itemTwo);

        jest.spyOn(itemOne, 'getBoundingClientRect').mockReturnValue({ height: 20 } as DOMRect);
        jest.spyOn(itemTwo, 'getBoundingClientRect').mockReturnValue({ height: 30 } as DOMRect);

        const items = (sharedGallery as any).getItems();

        (sharedGallery as any).layoutMasonry(items, 10, 0, 2);

        expect(itemOne.style.gridColumn).toBe('1');
        expect(itemTwo.style.gridColumn).toBe('2');
        expect(itemTwo.style.gridRowStart).not.toBe('');
        expect(itemTwo.style.gridRowEnd).not.toBe('');
      });
    });

    describe('onLayoutOrOrderChanged()', () => {
      it('should call syncResponsiveLayout and warnUnusedOrder when layout or order change', () => {
        const syncResponsiveLayoutSpy = jest.spyOn(sharedGallery as any, 'syncResponsiveLayout');
        const warnUnusedOrderSpy = jest.spyOn(sharedGallery as any, 'warnUnusedOrder');
        const rafSpy = jest.spyOn(helpers, 'raf').mockImplementation((cb) => {
          cb(0);
          return 0;
        });

        (sharedGallery as any).onLayoutOrOrderChanged();

        expect(syncResponsiveLayoutSpy).toHaveBeenCalledTimes(1);
        expect(rafSpy).toHaveBeenCalledTimes(1);
        expect(warnUnusedOrderSpy).toHaveBeenCalledTimes(1);

        syncResponsiveLayoutSpy.mockRestore();
        warnUnusedOrderSpy.mockRestore();
        rafSpy.mockRestore();
      });
    });

    describe('updateResponsiveStyles()', () => {
      it('should set the columns and gap CSS variables when the resolved values are valid', () => {
        sharedGallery.columns = { md: 5 };
        sharedGallery.gap = { md: 8 };

        // Mock the getBoundingClientRect method to return a fixed width
        // in order to test the updateResponsiveStyles method.
        jest.spyOn(sharedGallery.el, 'getBoundingClientRect').mockReturnValue({
          width: 768,
          height: 0,
          top: 0,
          left: 0,
          right: 768,
          bottom: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect);

        (sharedGallery as any).updateResponsiveStyles();

        expect(sharedGallery.el.style.getPropertyValue('--internal-gallery-columns')).toBe('5');
        expect(sharedGallery.el.style.getPropertyValue('--internal-gallery-gap')).toBe('8px');
      });
    });

    describe('scheduleMasonryResize()', () => {
      it('should clear masonry styles and not queue animation frame when layout is not masonry', () => {
        sharedGallery.layout = 'uniform';

        const clearMasonryStylesSpy = jest.spyOn(sharedGallery as any, 'clearMasonryStyles');
        const requestAnimationFrameSpy = jest.spyOn(globalThis, 'requestAnimationFrame');

        (sharedGallery as any).scheduleMasonryResize();

        expect(clearMasonryStylesSpy).toHaveBeenCalled();
        expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
      });

      it('should cancel pending animation frame and queue a new one when layout is masonry', () => {
        sharedGallery.layout = 'masonry';
        (sharedGallery as any).masonryRaf = 77;

        const cancelAnimationFrameSpy = jest
          .spyOn(globalThis, 'cancelAnimationFrame')
          .mockImplementation(() => undefined);
        const requestAnimationFrameSpy = jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(() => 123);

        (sharedGallery as any).scheduleMasonryResize();

        expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(77);
        expect(requestAnimationFrameSpy).toHaveBeenCalled();
        expect((sharedGallery as any).masonryRaf).toBe(123);

        cancelAnimationFrameSpy.mockRestore();
        requestAnimationFrameSpy.mockRestore();
      });
    });

    describe('onChildLoad()', () => {
      it('should not schedule masonry resize on child load when layout is not masonry', () => {
        sharedGallery.layout = 'uniform';

        const scheduleMasonryResizeSpy = jest.spyOn(sharedGallery as any, 'scheduleMasonryResize');

        (sharedGallery as any).onChildLoad(new Event('load'));

        expect(scheduleMasonryResizeSpy).not.toHaveBeenCalled();
      });

      it('should schedule masonry resize on child load when target is inside gallery and layout is masonry', () => {
        sharedGallery.layout = 'masonry';
        const galleryEl = document.createElement('ion-gallery');
        const child = document.createElement('div');
        galleryEl.appendChild(child);
        Object.defineProperty(sharedGallery, 'el', {
          value: galleryEl,
          configurable: true,
        });

        const scheduleMasonryResizeSpy = jest.spyOn(sharedGallery as any, 'scheduleMasonryResize');
        const event = new Event('load');
        Object.defineProperty(event, 'target', { value: child });

        (sharedGallery as any).onChildLoad(event);

        expect(scheduleMasonryResizeSpy).toHaveBeenCalled();
      });

      it('should not schedule masonry resize on child load when target is outside gallery', () => {
        sharedGallery.layout = 'masonry';
        const galleryEl = document.createElement('ion-gallery');
        const outsideChild = document.createElement('div');
        Object.defineProperty(sharedGallery, 'el', {
          value: galleryEl,
          configurable: true,
        });

        const scheduleMasonryResizeSpy = jest.spyOn(sharedGallery as any, 'scheduleMasonryResize');
        const event = new Event('load');
        Object.defineProperty(event, 'target', { value: outsideChild });

        (sharedGallery as any).onChildLoad(event);

        expect(scheduleMasonryResizeSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('gallery: order', () => {
    describe('warnUnusedOrder()', () => {
      it('should not warn when both layout and order are not explicitly set', () => {
        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        (sharedGallery as any).warnUnusedOrder();

        expect(warningSpy).not.toHaveBeenCalled();
        warningSpy.mockRestore();
      });

      it('should not warn when order is not explicitly set and layout is set to uniform', () => {
        sharedGallery.layout = 'uniform';

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        (sharedGallery as any).warnUnusedOrder();

        expect(warningSpy).not.toHaveBeenCalled();
        warningSpy.mockRestore();
      });

      it('should not warn when order is explicitly set and layout is masonry', () => {
        sharedGallery.layout = 'masonry';
        sharedGallery.order = 'sequential';

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        (sharedGallery as any).warnUnusedOrder();

        expect(warningSpy).not.toHaveBeenCalled();
        warningSpy.mockRestore();
      });

      it('should warn when order is explicitly set and layout is uniform', () => {
        sharedGallery.layout = 'uniform';
        sharedGallery.order = 'sequential';

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        (sharedGallery as any).warnUnusedOrder();

        expect(warningSpy).toHaveBeenCalledTimes(1);
        warningSpy.mockRestore();
      });

      it('should warn when order is non-default and layout is uniform', () => {
        sharedGallery.layout = 'uniform';
        sharedGallery.order = 'best-fit';

        const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

        (sharedGallery as any).warnUnusedOrder();

        expect(warningSpy).toHaveBeenCalledTimes(1);
        warningSpy.mockRestore();
      });
    });

    describe('getColumnIndex()', () => {
      it('should place items sequentially when order is set to sequential', () => {
        sharedGallery.layout = 'masonry';
        sharedGallery.order = 'sequential';

        expect((sharedGallery as any).getColumnIndex(0, [0, 0, 0], 3)).toBe(0);
        expect((sharedGallery as any).getColumnIndex(1, [1, 0, 0], 3)).toBe(1);
        expect((sharedGallery as any).getColumnIndex(2, [1, 1, 0], 3)).toBe(2);
        expect((sharedGallery as any).getColumnIndex(3, [1, 1, 1], 3)).toBe(0);
        expect((sharedGallery as any).getColumnIndex(4, [2, 1, 1], 3)).toBe(1);
      });

      it('should place items in the shortest column when order is set to best-fit', () => {
        sharedGallery.layout = 'masonry';
        sharedGallery.order = 'best-fit';

        expect((sharedGallery as any).getColumnIndex(5, [4, 2, 6], 3)).toBe(1);
        expect((sharedGallery as any).getColumnIndex(2, [3, 5, 1], 3)).toBe(2);
        expect((sharedGallery as any).getColumnIndex(9, [2, 3, 4], 3)).toBe(0);
      });

      it('should prefer the first shortest column when best-fit columns are tied', () => {
        sharedGallery.layout = 'masonry';
        sharedGallery.order = 'best-fit';

        expect((sharedGallery as any).getColumnIndex(7, [2, 2, 5], 3)).toBe(0);
        expect((sharedGallery as any).getColumnIndex(1, [3, 1, 1], 3)).toBe(1);
      });
    });
  });
});

describe('gallery: classes', () => {
  let originalResizeObserver: typeof globalThis.ResizeObserver | undefined;

  beforeEach(() => {
    originalResizeObserver = globalThis.ResizeObserver;
    (globalThis as any).ResizeObserver = class {
      observe() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    (globalThis as any).ResizeObserver = originalResizeObserver;
  });

  it('should apply default layout class when layout is not explicitly set', async () => {
    const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});
    const page = await newSpecPage({
      components: [Gallery],
      html: `<ion-gallery></ion-gallery>`,
    });
    const gallery = page.root as HTMLElement;

    expect(gallery.classList.contains('gallery-layout-uniform')).toBe(true);
    expect(gallery.classList.contains('gallery-layout-masonry')).toBe(false);
    expect(gallery.classList.contains('gallery-order-sequential')).toBe(false);
    expect(gallery.classList.contains('gallery-order-best-fit')).toBe(false);
    warningSpy.mockRestore();
  });

  it('should apply layout class without order class for uniform layout', async () => {
    const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});
    const page = await newSpecPage({
      components: [Gallery],
      html: `<ion-gallery layout="uniform" order="best-fit"></ion-gallery>`,
    });
    const gallery = page.root as HTMLElement;

    expect(gallery.classList.contains('gallery-layout-uniform')).toBe(true);
    expect(gallery.classList.contains('gallery-order-sequential')).toBe(false);
    expect(gallery.classList.contains('gallery-order-best-fit')).toBe(false);
    warningSpy.mockRestore();
  });

  it('should apply sequential order class for masonry layout by default', async () => {
    const page = await newSpecPage({
      components: [Gallery],
      html: `<ion-gallery layout="masonry"></ion-gallery>`,
    });
    const gallery = page.root as HTMLElement;

    expect(gallery.classList.contains('gallery-layout-masonry')).toBe(true);
    expect(gallery.classList.contains('gallery-order-sequential')).toBe(true);
    expect(gallery.classList.contains('gallery-order-best-fit')).toBe(false);
  });

  it('should apply best-fit order class for masonry layout when set', async () => {
    const page = await newSpecPage({
      components: [Gallery],
      html: `<ion-gallery layout="masonry" order="best-fit"></ion-gallery>`,
    });
    const gallery = page.root as HTMLElement;

    expect(gallery.classList.contains('gallery-layout-masonry')).toBe(true);
    expect(gallery.classList.contains('gallery-order-best-fit')).toBe(true);
    expect(gallery.classList.contains('gallery-order-sequential')).toBe(false);
  });
});
