import * as utils from '../utils';
import 'jest-dom/extend-expect'

describe('isCoveredByReact', () => {
  it('should identify standard events as covered by React', () => {
    expect(utils.isCoveredByReact('click', document)).toEqual(true);
  });
  it('should identify custom events as not covered by React', () => {
    expect(utils.isCoveredByReact('change', document)).toEqual(true);
    expect(utils.isCoveredByReact('ionchange', document)).toEqual(false);
  });
});

describe('syncEvent', () => {
  it('should add event on sync and readd on additional syncs', () => {
    var div = document.createElement("div");
    const addEventListener = jest.spyOn(div, "addEventListener");
    const removeEventListener = jest.spyOn(div, "removeEventListener");
    const ionClickCallback = jest.fn();

    utils.syncEvent(div, 'ionClick', ionClickCallback);
    expect(removeEventListener).not.toHaveBeenCalled();
    expect(addEventListener).toHaveBeenCalledWith('ionClick', expect.any(Function));

    utils.syncEvent(div, 'ionClick', ionClickCallback);
    expect(removeEventListener).toHaveBeenCalledWith('ionClick', expect.any(Function));
    expect(addEventListener).toHaveBeenCalledWith('ionClick', expect.any(Function));

    const event = new CustomEvent('ionClick', { detail: 'test'});
    div.dispatchEvent(event);
    expect(ionClickCallback).toHaveBeenCalled();
  })
});

describe('attachEventProps', () => {
  it('should pass props to a dom node', () => {
    const onIonClickCallback = () => {};

    var div = document.createElement("div");
    utils.attachEventProps(div, {
      'children': [],
      'style': 'color: red',
      'ref': () => {},
      'onClick': () => {},
      'onIonClick': onIonClickCallback,
      'testprop': ['red']
    });

    expect((div as any).testprop).toEqual(['red']);
    expect(div).toHaveStyle('');
    expect(Object.keys((div as any).__events)).toEqual(['ionClick']);
  });

});

describe('generateUniqueId', () => {
  const uniqueRegexMatch = /^(\w){8}-(\w){4}-(\w){4}-(\w){4}-(\w){12}$/;

  it('should generate a global unique id', () => {
    const first = utils.generateUniqueId();
    const second = utils.generateUniqueId();

    expect(first).toMatch(uniqueRegexMatch);
    expect(second).not.toEqual(first);
    expect(second).toMatch(uniqueRegexMatch);
  });
});
