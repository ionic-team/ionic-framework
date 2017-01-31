import { Ion } from '../../ion';
import { mockConfig, mockElementRef, mockRenderer } from '../../../util/mock-providers';


describe('Ion', () => {

  describe('color', () => {

    it('should set color when it hasnt been set yet', () => {
      ion._setMode('md');
      ion._setColor('primary');
      expect(className(ion)).toEqual('icon icon-md icon-md-primary');
    });

    it('should remove color when it has already been set', () => {
      ion._setMode('md');
      ion._setColor('primary');
      ion._setColor(null);
      expect(className(ion)).toEqual('icon icon-md');
    });

    it('should update color when it has already been set', () => {
      ion._setMode('md');
      ion._setColor('primary');
      ion._setColor('secondary');
      expect(className(ion)).toEqual('icon icon-md icon-md-secondary');
    });

    it('should not setElementClass if its the same value', () => {
      ion._setMode('ios');
      ion._setColor('primary');
      spyOn(ion, 'setElementClass');

      expect(ion.setElementClass).not.toHaveBeenCalled();
      ion._setColor('primary');

      expect(className(ion)).toEqual('icon icon-ios icon-ios-primary');
    });

  });

  var ion: Ion;

  beforeEach(() => {
    ion = new Ion(mockConfig(), mockElementRef(), mockRenderer(), 'icon');
  });

  function className(ion: Ion) {
    return ion._elementRef.nativeElement.className;
  }

});
