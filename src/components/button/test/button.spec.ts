import { Button, Config } from '../../../../src';


export function run() {

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
      expect(hasClass(b, 'bar-button-outline-primary')).toEqual(true);

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
      expect(hasClass(b, 'button-outline-primary')).toEqual(true);

      b._assignCss(false);
      expect(hasClass(b, 'button-outline')).toEqual(false);
      expect(hasClass(b, 'button-small')).toEqual(false);
      expect(hasClass(b, 'button-full')).toEqual(false);
      expect(hasClass(b, 'button-outline-primary')).toEqual(false);
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
      expect(hasClass(b, 'button-outline-primary')).toEqual(true);

      b = mockButton();
      b.clear = true;
      b.color = 'primary';
      b.color = 'secondary';

      b._assignCss(true);
      expect(hasClass(b, 'button')).toEqual(true);
      expect(hasClass(b, 'button-clear')).toEqual(true);
      expect(hasClass(b, 'button-clear-primary')).toEqual(false);
      expect(hasClass(b, 'button-clear-secondary')).toEqual(true);

      b = mockButton();
      b.solid = true;
      b.color = 'primary';
      b.color = 'secondary';

      b._assignCss(true);
      expect(hasClass(b, 'button')).toEqual(true);
      expect(hasClass(b, 'button-solid')).toEqual(true);
      expect(hasClass(b, 'button-primary')).toEqual(false);
      expect(hasClass(b, 'button-secondary')).toEqual(true);

      b = mockButton();
      b.solid = true;
      b.color = 'primary';
      b.color = 'secondary';

      b.setRole('bar-button');
      b._assignCss(true);
      expect(hasClass(b, 'bar-button-solid')).toEqual(true);
      expect(hasClass(b, 'bar-button-solid-primary')).toEqual(false);
      expect(hasClass(b, 'bar-button-solid-secondary')).toEqual(true);
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
      expect(hasClass(b, 'button-primary')).toEqual(true);

      b = mockButton();
      b.color = 'primary';
      b.color = 'secondary';
      b._assignCss(true);
      expect(hasClass(b, 'button-primary')).toEqual(false);
      expect(hasClass(b, 'button-secondary')).toEqual(true);
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

      b = mockButton();
      b.fab = true;
      b._assignCss(true);
      expect(hasClass(b, 'button-fab')).toEqual(true);
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
      let config = new Config({
        hoverCSS: false
      });
      let b = mockButton(config);

      expect(hasClass(b, 'disable-hover')).toEqual(true);
    });

    it('should set defaults', () => {
      let b = mockButton();
      expect(b._role).toEqual('button');
      expect(b._size).toEqual(null);
      expect(b._color).toEqual(null);
      expect(b._style).toEqual('default');
      expect(b._display).toEqual(null);
    });

    it('should add alert-button css class', () => {
      let b = mockButton(null, 'alert-button');
      b._assignCss(true);
      expect(hasClass(b, 'alert-button')).toEqual(true);
    });

  });

  function mockButton(config?, ionButton?) {
    config = config || new Config();
    ionButton = ionButton || '';
    let elementRef = {
      nativeElement: document.createElement('button')
    };
    let renderer: any = {
      setElementClass: function(nativeElement, className, shouldAdd) {
        nativeElement.classList[shouldAdd ? 'add' : 'remove'](className);
      }
    };
    let b = new Button(null, ionButton, config, elementRef, renderer);
    b._init = true;
    return b;
  }

  function hasClass(button, className) {
    return button._elementRef.nativeElement.classList.contains(className);
  }

}
