import { inheritAttributes } from '../helpers';

describe('inheritAttributes()', () => {
  it('should create an attribute inheritance object', () => {
    const el = document.createElement('div');
    el.setAttribute('tabindex', '20');
    el.setAttribute('title', 'myTitle');

    const attributeObject = inheritAttributes(el, ['tabindex', 'title']);

    expect(attributeObject).toEqual({
      tabindex: '20',
      title: 'myTitle',
    });
  });

  it('should not inherit attributes that are not defined on the element', () => {
    const el = document.createElement('div');
    el.setAttribute('tabindex', '20');

    const attributeObject = inheritAttributes(el, ['tabindex', 'title']);

    expect(attributeObject).toEqual({
      tabindex: '20',
    });
  });

  it('should not inherit attributes that are not defined on the input array', () => {
    const el = document.createElement('div');
    el.setAttribute('tabindex', '20');
    el.setAttribute('title', 'myTitle');

    const attributeObject = inheritAttributes(el, ['title']);

    expect(attributeObject).toEqual({
      title: 'myTitle',
    });
  });
});
