import * as utils from '../react-component-lib/utils';
import '@testing-library/jest-dom/extend-expect';

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

  it('should not write undefined props to a dom node', () => {
    var div = document.createElement('div');
    utils.attachProps(div, { id: undefined, title: undefined, testprop: undefined });

    expect(div.hasAttribute('id')).toEqual(false);
    expect(div.hasAttribute('title')).toEqual(false);
    expect('testprop' in div).toBe(false);
  });

  it('should clear a prop that no longer has a value', () => {
    var div = document.createElement('div');
    utils.attachProps(div, { id: 'my-id', testprop: ['red'] });
    utils.attachProps(div, { id: undefined, testprop: undefined }, { id: 'my-id', testprop: ['red'] });

    expect(div.hasAttribute('id')).toEqual(false);
    expect((div as any).testprop).toEqual(undefined);
  });

  it('should not write null native props to a dom node', () => {
    var div = document.createElement('div');
    utils.attachProps(div, { id: null, title: null, slot: null });

    expect(div.hasAttribute('id')).toEqual(false);
    expect(div.hasAttribute('title')).toEqual(false);
    expect(div.hasAttribute('slot')).toEqual(false);
  });

  it('should clear a native prop set to null', () => {
    var div = document.createElement('div');
    utils.attachProps(div, { id: 'my-id' });
    utils.attachProps(div, { id: null }, { id: 'my-id' });

    expect(div.hasAttribute('id')).toEqual(false);
  });

  it('should treat null as a value for a prop the element does not natively have', () => {
    var div = document.createElement('div');
    utils.attachProps(div, { value: 'my-value' });
    utils.attachProps(div, { value: null }, { value: 'my-value' });

    expect((div as any).value).toEqual(null);
  });

  it('should clear both attribute spellings of a camel cased native prop', () => {
    var div = document.createElement('div');
    // The property write reflects to `accesskey` while the dash-cased write
    // adds `access-key`, so both attributes end up on the element.
    utils.attachProps(div, { accessKey: 'k', tabIndex: 2 });
    utils.attachProps(div, { accessKey: undefined, tabIndex: undefined }, { accessKey: 'k', tabIndex: 2 });

    expect(div.hasAttribute('accesskey')).toEqual(false);
    expect(div.hasAttribute('access-key')).toEqual(false);
    expect(div.hasAttribute('tabindex')).toEqual(false);
  });
});
