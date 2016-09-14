import { Ion } from '../../ion';
import { mockConfig, mockElementRef, mockRenderer } from '../../../util/mock-providers';


describe('Ion', () => {

  describe('color', () => {

    it('should set color when it hasnt been set yet', () => {
      ion._setMode('icon', 'md');
      ion._setColor('icon', 'primary');
      expect(className(ion)).toEqual('icon-md icon-md-primary');
    });

    it('should remove color when it has already been set', () => {
      ion._setMode('icon', 'md');
      ion._setColor('icon', 'primary');
      ion._setColor('icon', null);
      expect(className(ion)).toEqual('icon-md');
    });

    it('should update color when it has already been set', () => {
      ion._setMode('icon', 'md');
      ion._setColor('icon', 'primary');
      ion._setColor('icon', 'secondary');
      expect(className(ion)).toEqual('icon-md icon-md-secondary');
    });

    it('should not setElementClass if its the same value', () => {
      ion._setMode('icon', 'ios');
      ion._setColor('icon', 'primary');
      spyOn(ion, 'setElementClass');

      expect(ion.setElementClass).not.toHaveBeenCalled();
      ion._setColor('icon', 'primary');

      expect(className(ion)).toEqual('icon-ios icon-ios-primary');
    });

  });

  var ion: Ion;

  beforeEach(() => {
    ion = new Ion(mockConfig(), mockElementRef(), mockRenderer());
  });

  function className(ion: Ion) {
    return ion._elementRef.nativeElement.className;
  }

});
