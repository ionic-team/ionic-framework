import * as tapClick from '../../../../ionic';

export function run() {

  describe("TapClick", () => {

    describe("isActivatable", () => {

      it('should be activatable on <a> element', () => {
        let ele = document.createElement('a');
        expect( tapClick.isActivatable(ele) ).toBe(true);
      });

      it('should be activatable on <button> element', () => {
        let ele = document.createElement('button');
        expect( tapClick.isActivatable(ele) ).toBe(true);
      });

      it('should be activatable on <ion-item-sliding> element', () => {
        let ele = document.createElement('ion-item-sliding');
        expect( tapClick.isActivatable(ele) ).toBe(false);
      });

      it('should be not activatable on <ion-item> element', () => {
        let ele = document.createElement('ion-item');
        expect( tapClick.isActivatable(ele) ).toBe(false);
      });

      it('should be not activatable on <div> element', () => {
        let ele = document.createElement('div');
        expect( tapClick.isActivatable(ele) ).toBe(false);
      });

      it('should be activatable with "tappable" attribute', () => {
        let ele = document.createElement('div');
        ele.setAttribute('tappable', true);
        expect( tapClick.isActivatable(ele) ).toBe(true);
      });

    });

  });

}
