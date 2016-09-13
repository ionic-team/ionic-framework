import { Ion } from '../../ion';
import { mockConfig, mockElementRef, mockRenderer } from '../../../util/mock-providers';


describe('Ion', () => {

  describe('color', () => {

    it('should set color when it hasnt been set yet', () => {
      ion._setColor('icon', 'primary');
      expect(hasClass(ion, 'icon-primary')).toEqual(true);
    });

    it('should remove color when it has already been set', () => {
      ion._setColor('icon', 'primary');
      ion._setColor('icon', null);
      expect(hasClass(ion, 'icon-primary')).toEqual(false);
    });

    it('should update color when it has already been set', () => {
      ion._setColor('icon', 'primary');
      ion._setColor('icon', 'secondary');
      expect(hasClass(ion, 'icon-primary')).toEqual(false);
      expect(hasClass(ion, 'icon-secondary')).toEqual(true);
    });

    it('should not setElementClass if its the same value', () => {
      ion._setColor('icon', 'primary');
      spyOn(ion, 'setElementClass');

      expect(ion.setElementClass).not.toHaveBeenCalled();
      ion._setColor('icon', 'primary');

      expect(hasClass(ion, 'icon-primary')).toEqual(true);
    });

  });

  describe('mode', () => {

    it('', () => {

    });

  });

  var ion: Ion;

  beforeEach(() => {
    ion = new Ion(mockConfig(), mockElementRef(), mockRenderer());
  });

  function hasClass(ion: Ion, className: string) {
    return ion._elementRef.nativeElement.classList.contains(className);
  }

});
