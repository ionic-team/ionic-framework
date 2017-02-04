import { Button } from '../button';
import { Config } from '../../../config/config';
import { mockConfig, mockElementRef, mockRenderer } from '../../../util/mock-providers';


describe('button', () => {

  it('should set a different button role', () => {
    let b = mockButton();
    b.outline = true;
    b.small = true;
    b.full = true;
    b.color = 'primary';
    b.setRole('bar-button');
    b._assignCss(true);

    expect(hasClass(b, 'bar-button-outline')).toEqual(true);
    expect(hasClass(b, 'bar-button-small')).toEqual(true);
    expect(hasClass(b, 'bar-button-full')).toEqual(true);
    expect(hasClass(b, 'bar-button-outline-ios-primary')).toEqual(true);

    expect(hasClass(b, 'button-outline')).toEqual(false);
    expect(hasClass(b, 'button-small')).toEqual(false);
    expect(hasClass(b, 'button-full')).toEqual(false);
    expect(hasClass(b, 'button-primary')).toEqual(false);
  });

  it('should remove button color attributes and add different role', () => {
    let b = mockButton();
    b.outline = true;
    b.small = true;
    b.full = true;
    b.color = 'primary';

    b._assignCss(true);
    expect(hasClass(b, 'button-outline')).toEqual(true);
    expect(hasClass(b, 'button-small')).toEqual(true);
    expect(hasClass(b, 'button-full')).toEqual(true);
    expect(hasClass(b, 'button-outline-ios-primary')).toEqual(true);

    b._assignCss(false);
    expect(hasClass(b, 'button-outline')).toEqual(false);
    expect(hasClass(b, 'button-small')).toEqual(false);
    expect(hasClass(b, 'button-full')).toEqual(false);
    expect(hasClass(b, 'button-outline-ios-primary')).toEqual(false);
  });

  it('should read button color attributes with styles', () => {
    let b = mockButton();
    b.outline = true;
    b.small = true;
    b.full = true;
    b.color = 'primary';

    b._assignCss(true);
    expect(hasClass(b, 'button')).toEqual(true);
    expect(hasClass(b, 'button-outline')).toEqual(true);
    expect(hasClass(b, 'button-small')).toEqual(true);
    expect(hasClass(b, 'button-full')).toEqual(true);
    expect(hasClass(b, 'button-outline-ios-primary')).toEqual(true);

    b = mockButton();
    b.clear = true;
    b.color = 'primary';
    b.color = 'secondary';

    b._assignCss(true);
    expect(hasClass(b, 'button')).toEqual(true);
    expect(hasClass(b, 'button-clear')).toEqual(true);
    expect(hasClass(b, 'button-clear-ios-primary')).toEqual(false);
    expect(hasClass(b, 'button-clear-ios-secondary')).toEqual(true);

    b = mockButton();
    b.solid = true;
    b.color = 'primary';
    b.color = 'secondary';

    b._assignCss(true);
    expect(hasClass(b, 'button')).toEqual(true);
    expect(hasClass(b, 'button-solid')).toEqual(true);
    expect(hasClass(b, 'button-ios-primary')).toEqual(false);
    expect(hasClass(b, 'button-ios-secondary')).toEqual(true);

    b = mockButton();
    b.solid = true;
    b.color = 'primary';
    b.color = 'secondary';

    b.setRole('bar-button');
    b._assignCss(true);
    expect(hasClass(b, 'bar-button-solid')).toEqual(true);
    expect(hasClass(b, 'bar-button-solid-ios-primary')).toEqual(false);
    expect(hasClass(b, 'bar-button-solid-ios-secondary')).toEqual(true);
  });

  it('should auto add the default style', () => {
    let b = mockButton();
    b._assignCss(true);
    expect(hasClass(b, 'button')).toEqual(true);
    expect(hasClass(b, 'button-default')).toEqual(true);

    b = mockButton();
    b.clear = true;

    b._assignCss(true);
    expect(hasClass(b, 'button')).toEqual(true);
    expect(hasClass(b, 'button-default')).toEqual(false);
    expect(hasClass(b, 'button-clear')).toEqual(true);
  });

  it('should read button color attributes', () => {
    let b = mockButton();
    b.color = 'primary';
    b._assignCss(true);
    expect(hasClass(b, 'button-ios-primary')).toEqual(true);

    b = mockButton();
    b.color = 'primary';
    b.color = 'secondary';
    b._assignCss(true);
    expect(hasClass(b, 'button-ios-primary')).toEqual(false);
    expect(hasClass(b, 'button-ios-secondary')).toEqual(true);
  });

  it('should read button style attributes', () => {
    let b = mockButton();
    b.clear = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-clear')).toEqual(true);

    b = mockButton();
    b.outline = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-outline')).toEqual(true);

    b = mockButton();
    b.solid = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-solid')).toEqual(true);

    b = mockButton();
    b.clear = true;
    b.outline = true;
    b.small = true;
    b.full = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-clear')).toEqual(false);
    expect(hasClass(b, 'button-outline')).toEqual(true);
    expect(hasClass(b, 'button-small')).toEqual(true);
    expect(hasClass(b, 'button-full')).toEqual(true);

    b = mockButton();
    b.outline = true;
    b.setRole('bar-button');
    b._assignCss(true);
    expect(hasClass(b, 'bar-button-outline')).toEqual(true);
  });

  it('should read button shape attributes', () => {
    let b = mockButton();
    b.round = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-round')).toEqual(true);
  });

  it('should read button display attributes', () => {
    let b = mockButton();
    b.block = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-block')).toEqual(true);

    b = mockButton();
    b.full = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-full')).toEqual(true);

    b = mockButton();
    b.block = true;
    b.full = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-block')).toEqual(false);
    expect(hasClass(b, 'button-full')).toEqual(true);
  });

  it('should read button size attributes', () => {
    let b = mockButton();
    b.small = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-small')).toEqual(true);

    b = mockButton();
    b.large = true;
    b._assignCss(true);
    expect(hasClass(b, 'button-large')).toEqual(true);

    b = mockButton();
    b.large = true;
    b.small = true;
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
    let config = mockConfig({
      hoverCSS: false
    });
    let b = mockButton(config);

    expect(hasClass(b, 'disable-hover')).toEqual(true);
  });

  it('should set defaults', () => {
    let b = mockButton();
    expect(b._role).toEqual('button');
    expect(b._size).toEqual(undefined);
    expect(b._color).toEqual(undefined);
    expect(b._style).toEqual('default');
    expect(b._display).toEqual(undefined);
  });

  it('should set different modes', () => {
    let b = mockButton();

    b._assignCss(true);
    expect(b._mode).toEqual('ios');
    expect(hasClass(b, 'button')).toEqual(true);
    expect(hasClass(b, 'button-ios')).toEqual(true);

    b.mode = 'wp';
    expect(b._mode).toEqual('wp');
    expect(hasClass(b, 'button-wp')).toEqual(true);

    b.mode = 'blah';
    expect(b._mode).toEqual('blah');
    expect(hasClass(b, 'button-blah')).toEqual(true);
  });

  it('should add alert-button css class', () => {
    let b = mockButton(null, 'alert-button');
    b._assignCss(true);
    expect(hasClass(b, 'alert-button')).toEqual(true);
  });

});

function mockButton(config?: Config, ionButton?: string) {
  config = config || mockConfig();
  ionButton = ionButton || '';
  let b = new Button(ionButton, config, mockElementRef(), mockRenderer());
  b._init = true;
  b.mode = 'ios';
  return b;
}

function hasClass(button: any, className: string) {
  return button._elementRef.nativeElement.classList.contains(className);
}
