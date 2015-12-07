import {Button, Config} from 'ionic/ionic';

export function run() {

  function mockButton(attrs, config) {
    config = config || new Config();
    let elementRef = {
      nativeElement: document.createElement('button')
    };
    if (attrs) {
      for (let i = 0; i < attrs.length; i++) {
        elementRef.nativeElement.setAttribute(attrs[i], '');
      }
    }
    let renderer = {
      setElementClass: function(elementRef, className, shouldAdd) {
        elementRef.nativeElement.classList[shouldAdd ? 'add' : 'remove'](className);
      }
    };
    return new Button(config, elementRef, renderer);
  }

  function hasClass(button, className) {
    return button.elementRef.nativeElement.classList.contains(className);
  }

  it('should set a different button role', () => {
    let b = mockButton(['outline', 'small', 'full', 'primary']);
    b.setRole('bar-button')
    b._assignCss(true);
    expect(hasClass(b, 'bar-button-outline')).toEqual(true);
    expect(hasClass(b, 'bar-button-small')).toEqual(true);
    expect(hasClass(b, 'bar-button-full')).toEqual(true);
    expect(hasClass(b, 'bar-button-primary')).toEqual(true);

    expect(hasClass(b, 'button-outline')).toEqual(false);
    expect(hasClass(b, 'button-small')).toEqual(false);
    expect(hasClass(b, 'button-full')).toEqual(false);
    expect(hasClass(b, 'button-primary')).toEqual(false);
  });

  it('should remove button color attributes and add different role', () => {
    let b = mockButton(['outline', 'small', 'full', 'primary']);
    b._assignCss(true);
    expect(hasClass(b, 'button-outline')).toEqual(true);
    expect(hasClass(b, 'button-small')).toEqual(true);
    expect(hasClass(b, 'button-full')).toEqual(true);
    expect(hasClass(b, 'button-primary')).toEqual(true);

    b._assignCss(false);
    expect(hasClass(b, 'button-outline')).toEqual(false);
    expect(hasClass(b, 'button-small')).toEqual(false);
    expect(hasClass(b, 'button-full')).toEqual(false);
    expect(hasClass(b, 'button-primary')).toEqual(false);
  });

  it('should read button color attributes', () => {
    let b = mockButton(['primary']);
    b._assignCss(true);
    expect(hasClass(b, 'button-primary')).toEqual(true);

    b = mockButton(['primary', 'secondary']);
    b._assignCss(true);
    expect(hasClass(b, 'button-primary')).toEqual(true);
    expect(hasClass(b, 'button-secondary')).toEqual(true);

    b = mockButton(['outline', 'small', 'full', 'primary']);
    b._assignCss(true);
    expect(hasClass(b, 'button-outline')).toEqual(true);
    expect(hasClass(b, 'button-small')).toEqual(true);
    expect(hasClass(b, 'button-full')).toEqual(true);
    expect(hasClass(b, 'button-primary')).toEqual(true);
  });

  it('should read button style attributes', () => {
    let b = mockButton(['round']);
    b._assignCss(true);
    expect(hasClass(b, 'button-round')).toEqual(true);

    b = mockButton(['clear']);
    b._assignCss(true);
    expect(hasClass(b, 'button-clear')).toEqual(true);

    b = mockButton(['outline']);
    b._assignCss(true);
    expect(hasClass(b, 'button-outline')).toEqual(true);

    b = mockButton(['fab']);
    b._assignCss(true);
    expect(hasClass(b, 'button-fab')).toEqual(true);

    b = mockButton(['clear', 'outline', 'small', 'full']);
    b._assignCss(true);
    expect(hasClass(b, 'button-clear')).toEqual(false);
    expect(hasClass(b, 'button-outline')).toEqual(true);
    expect(hasClass(b, 'button-small')).toEqual(true);
    expect(hasClass(b, 'button-full')).toEqual(true);
  });

  it('should read button display attributes', () => {
    let b = mockButton(['block']);
    b._assignCss(true);
    expect(hasClass(b, 'button-block')).toEqual(true);

    b = mockButton(['full']);
    b._assignCss(true);
    expect(hasClass(b, 'button-full')).toEqual(true);

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

  it('should not add button css class for ion-item attribute', () => {
    let b = mockButton(['ion-item']);
    b._assignCss(true);
    expect(hasClass(b, 'button')).toEqual(false);
  });

  it('should add button css class', () => {
    let b = mockButton();
    b._assignCss(true);
    expect(hasClass(b, 'button')).toEqual(true);
  });

  it('should add disable-hover css class', () => {
    let config = new Config({
      hoverCSS: false
    });
    let b = mockButton(null, config);

    expect(hasClass(b, 'disable-hover')).toEqual(true);
  });

  it('should set defaults', () => {
    let b = mockButton();
    expect(b._role).toEqual('button');
    expect(b._size).toEqual(null);
    expect(b._colors.length).toEqual(0);
    expect(b._style).toEqual(null);
    expect(b._display).toEqual(null);
  });

}
