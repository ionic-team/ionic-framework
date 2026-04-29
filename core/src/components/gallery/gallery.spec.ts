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

    describe('gallery layout', () => {
      it('should update responsive columns and schedule masonry resize when layout changes', () => {
        const updateResponsiveColumnsSpy = jest.spyOn(sharedGallery as any, 'updateResponsiveColumns');
        const scheduleMasonryResizeSpy = jest.spyOn(sharedGallery as any, 'scheduleMasonryResize');

        (sharedGallery as any).layoutChanged();

        expect(updateResponsiveColumnsSpy).toHaveBeenCalledWith(true);
        expect(scheduleMasonryResizeSpy).toHaveBeenCalled();
      });

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

    describe('gallery order', () => {
      it('should place items sequentially when order is set to sequential', () => {
        sharedGallery.order = 'sequential';

        expect((sharedGallery as any).getColumnIndex(0, [0, 0, 0], 3)).toBe(0);
        expect((sharedGallery as any).getColumnIndex(1, [1, 0, 0], 3)).toBe(1);
        expect((sharedGallery as any).getColumnIndex(2, [1, 1, 0], 3)).toBe(2);
        expect((sharedGallery as any).getColumnIndex(3, [1, 1, 1], 3)).toBe(0);
        expect((sharedGallery as any).getColumnIndex(4, [2, 1, 1], 3)).toBe(1);
      });

      it('should place items in the shortest column when order is set to best-fit', () => {
        sharedGallery.order = 'best-fit';

        expect((sharedGallery as any).getColumnIndex(5, [4, 2, 6], 3)).toBe(1);
        expect((sharedGallery as any).getColumnIndex(2, [3, 5, 1], 3)).toBe(2);
        expect((sharedGallery as any).getColumnIndex(9, [2, 3, 4], 3)).toBe(0);
      });

      it('should prefer the first shortest column when best-fit columns are tied', () => {
        sharedGallery.order = 'best-fit';

        expect((sharedGallery as any).getColumnIndex(7, [2, 2, 5], 3)).toBe(0);
        expect((sharedGallery as any).getColumnIndex(1, [3, 1, 1], 3)).toBe(1);
      });
    });
  });
});
