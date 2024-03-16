import { inheritAriaAttributes } from './helpers';

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
