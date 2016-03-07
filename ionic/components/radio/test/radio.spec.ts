import {RadioGroup, RadioButton, Form} from '../../../../ionic';

export function run() {
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

    let rg: RadioGroup;
    let form: Form;

    function createRadioButton() {
      return new RadioButton(form, null, rg);
    }

    function mockRenderer(): any {
      return {
        setElementAttribute: function(){}
      }
    }

    function mockElementRef(): any {
      return {
        nativeElement: document.createElement('div')
      }
    }

    beforeEach(() => {
      rg = new RadioGroup(mockRenderer(), mockElementRef());
      form = new Form();
    });

  });
}
