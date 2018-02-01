import { isActivatable } from '../tap-click';

describe('TapClick', () => {

  describe('isActivatable', () => {

    it('should be activatable on <a> element', () => {
      let ele = document.createElement('a');
      expect( isActivatable(ele) ).toBe(true);
    });

    it('should be activatable on <button> element', () => {
      let ele = document.createElement('button');
      expect( isActivatable(ele) ).toBe(true);
    });

    it('should be activatable on <ion-item-sliding> element', () => {
      let ele = document.createElement('ion-item-sliding');
      expect( isActivatable(ele) ).toBe(false);
    });

    it('should be not activatable on <ion-item> element', () => {
      let ele = document.createElement('ion-item');
      expect( isActivatable(ele) ).toBe(false);
    });

    it('should be not activatable on <div> element', () => {
      let ele = document.createElement('div');
      expect( isActivatable(ele) ).toBe(false);
    });

    it('should be activatable with "tappable" attribute', () => {
      let ele = document.createElement('div');
      ele.setAttribute('tappable', 'true');
      expect( isActivatable(ele) ).toBe(true);
    });

    it('should be not activatable on element without "hasAttribute" function', () => {
      let doc = document.createDocumentFragment();
      expect( isActivatable(<any>doc) ).toBe(false);
    });

  });

});
