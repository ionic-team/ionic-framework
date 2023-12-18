import * as utils from '../react-component-lib/utils';
// https://github.com/testing-library/jest-native/issues/72
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
});
