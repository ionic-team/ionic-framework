import * as utils from '../react-component-lib/utils';
import '@testing-library/jest-dom';

describe('isCoveredByReact', () => {
  it('should identify standard events as covered by React', () => {
    expect(utils.isCoveredByReact('click')).toEqual(true);
  });
  it('should identify custom events as not covered by React', () => {
    expect(utils.isCoveredByReact('change')).toEqual(true);
    expect(utils.isCoveredByReact('ionchange')).toEqual(false);
  });
});

describe('syncEvent', () => {
  it('should add event on sync and readd on additional syncs', () => {
    var div = document.createElement('div');
    const addEventListener = jest.spyOn(div, 'addEventListener');
    const removeEventListener = jest.spyOn(div, 'removeEventListener');
    const ionClickCallback = jest.fn();

    utils.syncEvent(div, 'ionClick', ionClickCallback);
    expect(removeEventListener).not.toHaveBeenCalled();
    expect(addEventListener).toHaveBeenCalledWith('ionClick', expect.any(Function));

    utils.syncEvent(div, 'ionClick', ionClickCallback);
    expect(removeEventListener).toHaveBeenCalledWith('ionClick', expect.any(Function));
    expect(addEventListener).toHaveBeenCalledWith('ionClick', expect.any(Function));

    const event = new CustomEvent('ionClick', { detail: 'test' });
    div.dispatchEvent(event);
    expect(ionClickCallback).toHaveBeenCalled();
  });
});

describe('attachProps', () => {
  it('should pass props to a dom node', () => {
    const onIonClickCallback = () => {};

    var div = document.createElement('div');
    utils.attachProps(div, {
      children: [],
      style: 'color: red',
      ref: () => {},
      onClick: () => {},
      onIonClick: onIonClickCallback,
      testprop: ['red'],
    });

    expect((div as any).testprop).toEqual(['red']);
    expect(div).toHaveStyle(`display: block;`);
    expect(Object.keys((div as any).__events)).toEqual(['ionClick']);
  });
});

describe('attachProps nullish props', () => {
  it('should not write undefined props to a dom node', () => {
    const div = document.createElement('div');

    utils.attachProps(div, { id: undefined, title: undefined, testprop: undefined });

    expect(div.hasAttribute('id')).toBe(false);
    expect(div.hasAttribute('title')).toBe(false);
    expect('testprop' in div).toBe(false);
  });

  it('should not write null native props to a dom node', () => {
    const div = document.createElement('div');

    utils.attachProps(div, { id: null, title: null, slot: null });

    expect(div.hasAttribute('id')).toBe(false);
    expect(div.hasAttribute('title')).toBe(false);
    expect(div.hasAttribute('slot')).toBe(false);
  });

  it('should clear a prop that no longer has a value', () => {
    const div = document.createElement('div');
    utils.attachProps(div, { id: 'my-id', testprop: ['red'] });

    utils.attachProps(div, { id: undefined, testprop: undefined }, { id: 'my-id', testprop: ['red'] });

    expect(div.hasAttribute('id')).toBe(false);
    expect((div as any).testprop).toBe(undefined);
  });

  it('should clear a native prop set to null', () => {
    const div = document.createElement('div');
    utils.attachProps(div, { id: 'my-id' });

    utils.attachProps(div, { id: null }, { id: 'my-id' });

    expect(div.hasAttribute('id')).toBe(false);
  });

  it('should treat null as a value for a prop the element does not natively have', () => {
    const div = document.createElement('div');
    utils.attachProps(div, { value: 'my-value' });

    utils.attachProps(div, { value: null }, { value: 'my-value' });

    expect((div as any).value).toBe(null);
  });

  it('should clear both attribute spellings of a camel cased native prop', () => {
    const div = document.createElement('div');
    // The property write reflects to `accesskey` while the dash-cased write
    // adds `access-key`, so both attributes end up on the element.
    utils.attachProps(div, { accessKey: 'k', tabIndex: 2 });

    utils.attachProps(div, { accessKey: undefined, tabIndex: undefined }, { accessKey: 'k', tabIndex: 2 });

    expect(div.hasAttribute('accesskey')).toBe(false);
    expect(div.hasAttribute('access-key')).toBe(false);
    expect(div.hasAttribute('tabindex')).toBe(false);
  });
});

describe('attachProps boolean attributes', () => {
  it('should strip a stray disabled="false" attribute when the prop is false', () => {
    const div = document.createElement('div');
    div.setAttribute('disabled', 'false');

    utils.attachProps(div, { disabled: false });

    expect(div.hasAttribute('disabled')).toBe(false);
  });

  it('should preserve aria-* attributes set to false', () => {
    const div = document.createElement('div');
    div.setAttribute('aria-expanded', 'false');

    utils.attachProps(div, { 'aria-expanded': false });

    expect(div.getAttribute('aria-expanded')).toBe('false');
  });

  it('should preserve data-* attributes set to false', () => {
    const div = document.createElement('div');
    div.setAttribute('data-active', 'false');

    utils.attachProps(div, { 'data-active': false });

    expect(div.getAttribute('data-active')).toBe('false');
  });

  it('should preserve enumerated attributes set to false (e.g. draggable)', () => {
    const div = document.createElement('div');
    div.setAttribute('draggable', 'false');

    utils.attachProps(div, { draggable: false });

    expect(div.getAttribute('draggable')).toBe('false');
  });
});
