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
  it('should add event to __events', () => {
    var div = document.createElement("div");
    utils.syncEvent(div, 'ionClick', () => {});

    expect(Object.keys((div as any).__events)).toEqual(['ionClick']);
  })
});

describe('ensureElementInBody', () => {
  it('should return if exists', () => {
    const element = document.createElement("some-random-thing");
    document.body.innerHTML = '';
    document.body.appendChild(element);

    const returnedElement = utils.ensureElementInBody('some-random-thing');
    expect(returnedElement).toEqual(element);
    expect(document.body.children.length).toEqual(1);
  });

  it('should create if it does not exist', () => {
    document.body.innerHTML = '';

    const returnedElement = utils.ensureElementInBody('some-random-thing');
    expect(returnedElement).toBeDefined();
    expect(returnedElement.tagName).toEqual('SOME-RANDOM-THING');
    expect(document.body.children.length).toEqual(1);
  });
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
