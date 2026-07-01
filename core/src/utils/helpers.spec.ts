import { inheritAriaAttributes, isEndSide } from './helpers';

describe('isEndSide', () => {
  afterEach(() => {
    document.dir = 'ltr';
  });

  it('should use document direction when no host element is provided', () => {
    document.dir = 'rtl';
    expect(isEndSide('start')).toBe(true);
    expect(isEndSide('end')).toBe(false);
  });

  it('should use the nearest ancestor dir attribute', () => {
    document.dir = 'ltr';

    const app = document.createElement('ion-app');
    app.setAttribute('dir', 'rtl');

    const menu = document.createElement('ion-menu');
    app.appendChild(menu);
    document.body.appendChild(app);

    expect(isEndSide('start', menu)).toBe(true);
    expect(isEndSide('end', menu)).toBe(false);

    document.body.removeChild(app);
  });

  it('should fall back to document direction when no ancestor has dir', () => {
    document.dir = 'rtl';

    const menu = document.createElement('ion-menu');
    document.body.appendChild(menu);

    expect(isEndSide('start', menu)).toBe(true);
    expect(isEndSide('end', menu)).toBe(false);

    document.body.removeChild(menu);
  });
});

describe('inheritAriaAttributes', () => {
  it('should inherit aria attributes', () => {
    const parent = document.createElement('div');
    parent.setAttribute('aria-label', 'parent');
    parent.setAttribute('aria-hidden', 'true');
    parent.setAttribute('role', 'button');

    const inheritedAriaAttributes = inheritAriaAttributes(parent);

    expect(inheritedAriaAttributes).toEqual({
      'aria-label': 'parent',
      'aria-hidden': 'true',
      role: 'button',
    });
  });

  it('should not inherit non-aria attributes', () => {
    const parent = document.createElement('button');
    parent.setAttribute('type', 'submit');

    const inheritedAriaAttributes = inheritAriaAttributes(parent);

    expect(inheritedAriaAttributes).toEqual({});
  });

  it('attributes that are ignored should not be returned', () => {
    const parent = document.createElement('div');
    parent.setAttribute('aria-label', 'parent');
    parent.setAttribute('aria-hidden', 'true');
    parent.setAttribute('role', 'button');

    const ignoreList = ['aria-hidden'];
    const inheritedAriaAttributes = inheritAriaAttributes(parent, ignoreList);

    expect(inheritedAriaAttributes).toEqual({
      'aria-label': 'parent',
      role: 'button',
    });
  });
});
