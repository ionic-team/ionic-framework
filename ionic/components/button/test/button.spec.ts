import {Button, Config} from '../../../../ionic';

export function run() {

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

    it('should remove button color attributes and add different role', () => {
      let b = mockButton(['outline', 'small', 'full', 'primary']);
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
      let b = mockButton(['outline', 'small', 'full', 'primary']);
      b._assignCss(true);
      expect(hasClass(b, 'button')).toEqual(true);
      expect(hasClass(b, 'button-outline')).toEqual(true);
      expect(hasClass(b, 'button-small')).toEqual(true);
      expect(hasClass(b, 'button-full')).toEqual(true);
      expect(hasClass(b, 'button-outline-primary')).toEqual(true);

      b = mockButton(['clear', 'primary', 'secondary']);
      b._assignCss(true);
      expect(hasClass(b, 'button')).toEqual(true);
      expect(hasClass(b, 'button-clear')).toEqual(true);
      expect(hasClass(b, 'button-clear-primary')).toEqual(true);
      expect(hasClass(b, 'button-clear-secondary')).toEqual(true);

      b = mockButton(['solid', 'primary', 'secondary']);
      b._assignCss(true);
      expect(hasClass(b, 'button')).toEqual(true);
      expect(hasClass(b, 'button-solid')).toEqual(true);
      expect(hasClass(b, 'button-solid-primary')).toEqual(true);
      expect(hasClass(b, 'button-solid-secondary')).toEqual(true);
    });

    it('should auto add the default style', () => {
      let b = mockButton();
      b._assignCss(true);
      expect(hasClass(b, 'button')).toEqual(true);
      expect(hasClass(b, 'button-default')).toEqual(true);

      b = mockButton(['clear']);
      b._assignCss(true);
      expect(hasClass(b, 'button')).toEqual(true);
      expect(hasClass(b, 'button-default')).toEqual(false);
      expect(hasClass(b, 'button-clear')).toEqual(true);
    });

    it('should read button color attributes', () => {
      let b = mockButton(['primary']);
      b._assignCss(true);
      expect(hasClass(b, 'button-primary')).toEqual(true);

      b = mockButton(['primary', 'secondary']);
      b._assignCss(true);
      expect(hasClass(b, 'button-primary')).toEqual(true);
      expect(hasClass(b, 'button-secondary')).toEqual(true);
    });

    it('should read button style attributes', () => {
      let b = mockButton(['clear']);
      b._assignCss(true);
      expect(hasClass(b, 'button-clear')).toEqual(true);

      b = mockButton(['outline']);
      b._assignCss(true);
      expect(hasClass(b, 'button-outline')).toEqual(true);

      b = mockButton(['clear', 'outline', 'small', 'full']);
      b._assignCss(true);
      expect(hasClass(b, 'button-clear')).toEqual(false);
      expect(hasClass(b, 'button-outline')).toEqual(true);
      expect(hasClass(b, 'button-small')).toEqual(true);
      expect(hasClass(b, 'button-full')).toEqual(true);
    });

    it('should read button shape attributes', () => {
      let b = mockButton(['round']);
      b._assignCss(true);
      expect(hasClass(b, 'button-round')).toEqual(true);

      b = mockButton(['fab']);
      b._assignCss(true);
      expect(hasClass(b, 'button-fab')).toEqual(true);
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
      expect(b._style).toEqual('default');
      expect(b._display).toEqual(null);
    });

  });

  function mockButton(attrs?, config?) {
    config = config || new Config();
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
    let b = new Button(config, elementRef, renderer, null);
    b._init = true;
    return b;
  }

  function hasClass(button, className) {
    return button._elementRef.nativeElement.classList.contains(className);
  }

}
