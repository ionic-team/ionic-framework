import { Button } from '../button';
import { Config } from '../../../config/config';
import { mockConfig } from '../../../util/mock-providers';

describe('button', () => {

  it('should ignore certain attributes', () => {
    let b = mockButton(['_ngcontent', 'button']);
    b._assignCss(true);
    expect(hasClass(b, 'button')).toEqual(true);
    expect(hasClass(b, 'button-_ngcontent')).toEqual(false);
    expect(hasClass(b, 'button-button')).toEqual(false);
  });

  it('should set a different button role', () => {
    let b = mockButton(['outline', 'small', 'full', 'primary']);
    b.setRole('bar-button');
    b._assignCss(true);
    expect(hasClass(b, 'bar-button-outline')).toEqual(true);
    expect(hasClass(b, 'bar-button-small')).toEqual(true);
    expect(hasClass(b, 'bar-button-full')).toEqual(true);
    expect(hasClass(b, 'bar-button-outline-primary')).toEqual(true);

    expect(hasClass(b, 'button-outline')).toEqual(false);
    expect(hasClass(b, 'button-small')).toEqual(false);
    expect(hasClass(b, 'button-full')).toEqual(false);
    expect(hasClass(b, 'button-primary')).toEqual(false);
  });

  function mockButton(attrs?, config?, ionButton?) {
    config = config || new Config();
    ionButton = ionButton || '';
    let elementRef = {
      nativeElement: document.createElement('button')
    };
    if (attrs) {
      for (let i = 0; i < attrs.length; i++) {
        elementRef.nativeElement.setAttribute(attrs[i], '');
      }
    }
    let renderer: any = {
      setElementClass: function(nativeElement, className, shouldAdd) {
        nativeElement.classList[shouldAdd ? 'add' : 'remove'](className);
      }
    };
    let b = new Button(null, ionButton, config, elementRef, renderer, null);
    b._init = true;
    return b;
  }

    b = mockButton(['block', 'full']);
    b._assignCss(true);
    expect(hasClass(b, 'button-block')).toEqual(false);
    expect(hasClass(b, 'button-full')).toEqual(true);
  });

  it('should read button size attributes', () => {
    let b = mockButton(['small']);
    b._assignCss(true);
    expect(hasClass(b, 'button-small')).toEqual(true);

    b = mockButton(['large']);
    b._assignCss(true);
    expect(hasClass(b, 'button-large')).toEqual(true);

    b = mockButton(['large', 'small']);
    b._assignCss(true);
    expect(hasClass(b, 'button-large')).toEqual(false);
    expect(hasClass(b, 'button-small')).toEqual(true);
  });

  it('should add button css class', () => {
    let b = mockButton();
    b._assignCss(true);
    expect(hasClass(b, 'button')).toEqual(true);
  });

  it('should add disable-hover css class', () => {
    let config = new Config();
    let b = mockButton(null, config);

    expect(hasClass(b, 'disable-hover')).toEqual(true);
  });

  it('should set defaults', () => {
    let b = mockButton();
    expect(b._role).toEqual('button');
    expect(b._size).toEqual(null);
    expect(b._colors.length).toEqual(0);
    expect(b._style).toEqual('default');
    expect(b._display).toEqual(null);
  });

  it('should add alert-button css class', () => {
    let b = mockButton(null, null, 'alert-button');
    b._assignCss(true);
    expect(hasClass(b, 'alert-button')).toEqual(true);
  });

});

function mockButton(attrs?, config?, ionButton?) {
  config = config || mockConfig();
  ionButton = ionButton || '';
  let elementRef = {
    nativeElement: document.createElement('button')
  };
  if (attrs) {
    for (let i = 0; i < attrs.length; i++) {
      elementRef.nativeElement.setAttribute(attrs[i], '');
    }
  }
  let renderer: any = {
    setElementClass: function(nativeElement, className, shouldAdd) {
      nativeElement.classList[shouldAdd ? 'add' : 'remove'](className);
    }
  };
  let b = new Button(ionButton, config, elementRef, renderer);
  b._init = true;
  return b;
}

function hasClass(button, className) {
  return button._elementRef.nativeElement.classList.contains(className);
}
