import { deepMerge, inheritAriaAttributes } from '../helpers';

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

describe('deepMerge', () => {
  it('should merge objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should merge objects when target is undefined', () => {
    const target = undefined;
    const source = { a: 1, b: 2 };
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should merge objects when source is undefined', () => {
    const target = { a: 1, b: 2 };
    const source = undefined;
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: 1, b: 2 });
  });
});
