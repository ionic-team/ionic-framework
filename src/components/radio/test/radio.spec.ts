import { RadioGroup } from '../radio-group';
import { RadioButton } from '../radio-button';
import { Form } from '../../../util/form';
import { mockChangeDetectorRef, mockConfig, mockElementRef, mockRenderer } from '../../../util/mock-providers';


describe('RadioGroup', () => {

  describe('_update', () => {

    it('should set checked via string values', () => {
      let rb1 = createRadioButton();
      rb1.value = 'string1';
      let rb2 = createRadioButton();
      rb2.value = 'string2';
      let rb3 = createRadioButton();
      rb3.value = 'string3';

      rg.value = 'string1';
      rg._update();

      expect(rb1.checked).toEqual(true);
      expect(rb2.checked).toEqual(false);
      expect(rb3.checked).toEqual(false);
    });

    it('should set checked via string group value, and number button values', () => {
      let rb1 = createRadioButton();
      rb1.value = 1;
      let rb2 = createRadioButton();
      rb2.value = 2;
      let rb3 = createRadioButton();
      rb3.value = 3;

      rg.value = '1';
      rg._update();

      expect(rb1.checked).toEqual(true);
      expect(rb2.checked).toEqual(false);
      expect(rb3.checked).toEqual(false);
    });

    it('should set checked via number group value, and string button values', () => {
      let rb1 = createRadioButton();
      rb1.value = '1';
      let rb2 = createRadioButton();
      rb2.value = '2';
      let rb3 = createRadioButton();
      rb3.value = '3';

      rg.value = 1;
      rg._update();

      expect(rb1.checked).toEqual(true);
      expect(rb2.checked).toEqual(false);
      expect(rb3.checked).toEqual(false);
    });

    it('should set checked via empty string group value, and one empty string button value', () => {
      let rb1 = createRadioButton();
      rb1.value = '';
      let rb2 = createRadioButton();
      rb2.value = 'value2';
      let rb3 = createRadioButton();
      rb3.value = 'value3';

      rg.value = '';
      rg._update();

      expect(rb1.checked).toEqual(true);
      expect(rb2.checked).toEqual(false);
      expect(rb3.checked).toEqual(false);
    });

    it('should only check at most one value', () => {
      let rb1 = createRadioButton();
      rb1.value = 'string1';
      let rb2 = createRadioButton();
      rb2.value = 'string1';
      let rb3 = createRadioButton();
      rb3.value = 'string1';

      rg.value = 'string1';
      rg._update();

      expect(rb1.checked).toEqual(true);
      expect(rb2.checked).toEqual(false);
      expect(rb3.checked).toEqual(false);
    });

  });

  beforeEach(() => {
    rg = new RadioGroup(mockRenderer(), mockElementRef(), mockChangeDetectorRef());
    form = new Form();
  });

});

describe('RadioButton', () => {

  describe('ngOnDestroy', () => {
    it('should work without a group', () => {
      let rb1 = createRadioButton(false);
      expect(() => rb1.ngOnDestroy()).not.toThrowError();
    });

    it('should remove button from group if part of a radio group', () => {
      let rb1 = createRadioButton();
      spyOn(rg, 'remove');
      rb1.ngOnDestroy();
      expect(rg.remove).toHaveBeenCalledWith(rb1);
    });

  });

  beforeEach(() => {
    rg = new RadioGroup(mockRenderer(), mockElementRef(), mockChangeDetectorRef());
    form = new Form();
  });

});

let rg: RadioGroup;
let form: Form;

function createRadioButton(shouldIncludeGroup = true) {
  return new RadioButton(form, mockConfig(), mockElementRef(), mockRenderer(), null, shouldIncludeGroup ? rg : null);
}
