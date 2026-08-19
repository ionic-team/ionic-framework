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

// Fixes https://github.com/ionic-team/ionic-framework/issues/31344
// jsdom's `HTMLElement.prototype` is missing props Chrome has, so a prop like `role` takes
// the component branch here and the native branch in a browser.
describe('attachProps nullish reflected props', () => {
  it('should not write an attribute for a reflected prop passed as undefined', () => {
    const div = document.createElement('div');

    utils.attachProps(div, { id: undefined, title: undefined, slot: undefined });

    expect(div.hasAttribute('id')).toBe(false);
    expect(div.hasAttribute('title')).toBe(false);
    expect(div.hasAttribute('slot')).toBe(false);
  });

  it('should not write an attribute for a reflected prop passed as null', () => {
    const div = document.createElement('div');

    utils.attachProps(div, { id: null, title: null });

    expect(div.hasAttribute('id')).toBe(false);
    expect(div.hasAttribute('title')).toBe(false);
  });

  it('should remove the attribute when a reflected prop becomes undefined', () => {
    const div = document.createElement('div');
    utils.attachProps(div, { id: 'real-id' });
    expect(div.getAttribute('id')).toBe('real-id');

    utils.attachProps(div, { id: undefined }, { id: 'real-id' });

    expect(div.hasAttribute('id')).toBe(false);
  });

  it('should remove both attribute spellings of a camel cased reflected prop', () => {
    const div = document.createElement('div');
    utils.attachProps(div, { accessKey: 'k' });

    utils.attachProps(div, { accessKey: undefined }, { accessKey: 'k' });

    expect(div.hasAttribute('accesskey')).toBe(false);
    expect(div.hasAttribute('access-key')).toBe(false);
  });

  it('should not leave a stringified value for a nullish enumerated prop', () => {
    const div = document.createElement('div');

    // Assigning `undefined` gives `draggable="false"` and `translate="no"`, which look like real values.
    utils.attachProps(div, { draggable: undefined, translate: undefined });

    expect(div.hasAttribute('draggable')).toBe(false);
    expect(div.hasAttribute('translate')).toBe(false);
  });

  it('should still assign a component prop set to null', () => {
    const div = document.createElement('div');

    // Passing `spinner={null}` to `ion-loading` means no spinner, while `undefined` gets the mode default.
    utils.attachProps(div, { spinner: null });

    expect((div as any).spinner).toBe(null);
  });

  it('should not remove the attribute of a component prop set to null', () => {
    const div = document.createElement('div');
    utils.attachProps(div, { spinner: 'bubbles' });

    utils.attachProps(div, { spinner: null }, { spinner: 'bubbles' });

    expect(div.getAttribute('spinner')).toBe('bubbles');
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
