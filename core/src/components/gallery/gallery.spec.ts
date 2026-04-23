import * as logging from '@utils/logging';

import { Gallery } from './gallery';

let sharedGallery: Gallery;

// This should match the default columns defined by the gallery component.
// It is hardcoded here instead of grabbing the value from the gallery so
// that changing it there without updating it here will break the tests.
const DEFAULT_COLUMNS_BY_BREAKPOINT = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 6,
  xl: 8,
  xxl: 10,
};

// The expected columns for each breakpoint when the columns property is
// not set or is set to an invalid value.
const DEFAULT_COLUMNS_BREAKPOINTS = [
  // xs
  { width: 0, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xs'] },
  { width: 575, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xs'] },
  // sm
  { width: 576, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['sm'] },
  { width: 767, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['sm'] },
  // md
  { width: 768, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['md'] },
  { width: 991, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['md'] },
  // lg
  { width: 992, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['lg'] },
  { width: 1199, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['lg'] },
  // xl
  { width: 1200, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xl'] },
  { width: 1399, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xl'] },
  // xxl
  { width: 1400, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xxl'] },
];

describe('gallery: properties', () => {
  beforeEach(() => {
    sharedGallery = new Gallery();
  });
  describe('gallery columns', () => {
    it('should resolve to the default columns for each breakpoint', () => {
      const breakpoints = DEFAULT_COLUMNS_BREAKPOINTS;

      breakpoints.forEach(({ width, expectedColumns }) => {
        expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
      });
    });

    it('should fallback to the default columns when the columns property is set to a negative integer', () => {
      const breakpoints = DEFAULT_COLUMNS_BREAKPOINTS;

      const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

      const el = document.createElement('ion-gallery');
      Object.defineProperty(sharedGallery, 'el', {
        value: el,
        configurable: true,
      });
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

    it('should fallback to the default columns when the columns property is set to an invalid string', () => {
      const breakpoints = DEFAULT_COLUMNS_BREAKPOINTS;

      const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

      const el = document.createElement('ion-gallery');
      Object.defineProperty(sharedGallery, 'el', {
        value: el,
        configurable: true,
      });
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
      const breakpoints = DEFAULT_COLUMNS_BREAKPOINTS;

      const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

      const el = document.createElement('ion-gallery');
      Object.defineProperty(sharedGallery, 'el', {
        value: el,
        configurable: true,
      });
      sharedGallery.columns = { xs: 'invalid', sm: -3 };

      breakpoints.forEach(({ width, expectedColumns }) => {
        expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
      });

      expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('[ion-gallery] - Invalid "columns" value'), el);

      warningSpy.mockRestore();
    });

    it('should properly set columns for the md breakpoint but fallback to the default columns for all others when the columns property is set to an object with one valid breakpoint and the rest invalid', () => {
      const breakpoints = [
        // xs
        { width: 0, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xs'] },
        { width: 575, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xs'] },
        // sm
        { width: 576, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['sm'] },
        { width: 767, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['sm'] },
        // md
        { width: 768, expectedColumns: 5 },
        { width: 991, expectedColumns: 5 },
        // lg
        { width: 992, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['lg'] },
        { width: 1199, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['lg'] },
        // xl
        { width: 1200, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xl'] },
        { width: 1399, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xl'] },
        // xxl
        { width: 1400, expectedColumns: DEFAULT_COLUMNS_BY_BREAKPOINT['xxl'] },
      ];

      const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

      const el = document.createElement('ion-gallery');
      Object.defineProperty(sharedGallery, 'el', {
        value: el,
        configurable: true,
      });
      sharedGallery.columns = { xs: 'invalid', sm: -3, md: 5, lg: 'foo', xl: 'bar', xxl: 'baz' };

      breakpoints.forEach(({ width, expectedColumns }) => {
        expect((sharedGallery as any).getColumnsForWidth(width)).toBe(expectedColumns);
      });

      expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('[ion-gallery] - Invalid "columns" value'), el);

      warningSpy.mockRestore();
    });

    it('should fallback to the default columns when the columns property is set to an unaccepted type', () => {
      const breakpoints = DEFAULT_COLUMNS_BREAKPOINTS;

      const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

      const el = document.createElement('ion-gallery');
      Object.defineProperty(sharedGallery, 'el', {
        value: el,
        configurable: true,
      });
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
