import {
  isTriggerElement,
  getIndexOfItem,
  getNextItem,
  getPrevItem,
  getElementCSSZoom,
  getPopoverDimensions,
  getArrowDimensions,
} from '../utils';

describe('getElementCSSZoom', () => {
  it('should return 1 when no element is provided', () => {
    expect(getElementCSSZoom(null)).toEqual(1);
  });

  it('should use currentCSSZoom when available', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'currentCSSZoom', { value: 1.5, configurable: true });

    expect(getElementCSSZoom(el)).toEqual(1.5);
  });

  it('should fall back to the ratio between the client rect and offsetWidth', () => {
    const el = document.createElement('div');
    // No currentCSSZoom support in this environment.
    el.getBoundingClientRect = () => ({ width: 300, height: 0, top: 0, left: 0, bottom: 0, right: 0 } as DOMRect);
    Object.defineProperty(el, 'offsetWidth', { value: 200, configurable: true });

    expect(getElementCSSZoom(el)).toEqual(1.5);
  });

  it('should treat sub-pixel rounding in the fallback as no zoom', () => {
    const el = document.createElement('div');
    // offsetWidth is rounded to an integer, the bounding rect is not.
    el.getBoundingClientRect = () => ({ width: 250.4, height: 0, top: 0, left: 0, bottom: 0, right: 0 } as DOMRect);
    Object.defineProperty(el, 'offsetWidth', { value: 250, configurable: true });

    expect(getElementCSSZoom(el)).toEqual(1);
  });

  it('should return 1 when the fallback measurements are unavailable', () => {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0 } as DOMRect);
    Object.defineProperty(el, 'offsetWidth', { value: 0, configurable: true });

    expect(getElementCSSZoom(el)).toEqual(1);
  });
});

describe('getPopoverDimensions', () => {
  it('should normalize the content dimensions by the zoom factor', () => {
    const contentEl = document.createElement('div');
    contentEl.getBoundingClientRect = () =>
      ({ width: 300, height: 450, top: 0, left: 0, bottom: 0, right: 0 } as DOMRect);

    const { contentWidth, contentHeight } = getPopoverDimensions('auto', contentEl, undefined, 1.5);

    expect(contentWidth).toEqual(200);
    expect(contentHeight).toEqual(300);
  });

  it('should normalize the trigger width by the zoom factor when size is cover', () => {
    const contentEl = document.createElement('div');
    contentEl.getBoundingClientRect = () =>
      ({ width: 300, height: 450, top: 0, left: 0, bottom: 0, right: 0 } as DOMRect);
    const triggerEl = document.createElement('div');
    triggerEl.getBoundingClientRect = () =>
      ({ width: 150, height: 60, top: 0, left: 0, bottom: 0, right: 0 } as DOMRect);

    const { contentWidth } = getPopoverDimensions('cover', contentEl, triggerEl, 1.5);

    expect(contentWidth).toEqual(100);
  });
});

describe('getArrowDimensions', () => {
  it('should normalize the arrow dimensions by the zoom factor', () => {
    const arrowEl = document.createElement('div');
    arrowEl.getBoundingClientRect = () => ({ width: 15, height: 15, top: 0, left: 0, bottom: 0, right: 0 } as DOMRect);

    const { arrowWidth, arrowHeight } = getArrowDimensions(arrowEl, 1.5);

    expect(arrowWidth).toEqual(10);
    expect(arrowHeight).toEqual(10);
  });
});

describe('isTriggerElement', () => {
  it('should return true is element is a trigger', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ion-popover-trigger', 'true');

    expect(isTriggerElement(el)).toEqual(true);
  });

  it('should return false is element is not a trigger', () => {
    const el = document.createElement('div');

    expect(isTriggerElement(el)).toEqual(false);
  });
});

describe('getIndexOfItem', () => {
  it('should return the correct index in an array of ion-items', () => {
    const array = createArrayOfElements(['ion-item', 'ion-item', 'ion-item']) as HTMLIonItemElement[];

    expect(getIndexOfItem(array, array[1])).toEqual(1);
  });

  it('should return -1 when ion-item not found', () => {
    const el = document.createElement('ion-item');
    const array = createArrayOfElements(['ion-item', 'ion-item']) as HTMLIonItemElement[];

    expect(getIndexOfItem(array, el)).toEqual(-1);
  });

  it('should return -1 if a non-ion-item is passed in', () => {
    const array = createArrayOfElements(['ion-item', 'div', 'ion-item']) as HTMLIonItemElement[];

    expect(getIndexOfItem(array, array[1])).toEqual(-1);
  });
});

describe('getNextItem', () => {
  it('should get the next item in an array of ion-items', () => {
    const array = createArrayOfElements(['ion-item', 'ion-item', 'ion-item']) as HTMLIonItemElement[];
    expect(getNextItem(array, array[1])).toEqual(array[2]);
  });

  it('should return undefined if there is no next item', () => {
    const array = createArrayOfElements(['ion-item', 'ion-item', 'ion-item']) as HTMLIonItemElement[];
    expect(getNextItem(array, array[2])).toEqual(undefined);
  });
});

describe('getPrevItem', () => {
  it('should get the previous item in an array of ion-items', () => {
    const array = createArrayOfElements(['ion-item', 'ion-item', 'ion-item']) as HTMLIonItemElement[];
    expect(getPrevItem(array, array[1])).toEqual(array[0]);
  });

  it('should return undefined if there is no previous item', () => {
    const array = createArrayOfElements(['ion-item', 'ion-item', 'ion-item']) as HTMLIonItemElement[];
    expect(getPrevItem(array, array[0])).toEqual(undefined);
  });
});

const createArrayOfElements = (tags: string[]) => {
  return tags.map((tag) => document.createElement(tag));
};
