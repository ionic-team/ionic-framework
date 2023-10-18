
describe('Value Accessors', () => {

  describe('Checkbox', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/checkbox'));

    it('should update the form value', () => {
      cy.get('#formValue').should('have.text', JSON.stringify({ checkbox: false }, null, 2));
      cy.get('ion-checkbox').should('have.class', 'ion-pristine');

      cy.get('ion-checkbox').click();

      cy.get('#formValue').should('have.text', JSON.stringify({ checkbox: true }, null, 2));
      cy.get('ion-checkbox').should('have.class', 'ion-dirty');
      cy.get('ion-checkbox').should('have.class', 'ion-valid');
    });

    it('should proxy inputs on load', () => {
      cy.get('ion-checkbox').should('have.prop', 'color', 'danger');
    });
  });

  describe('Datetime', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/datetime'));

    it('should proxy inputs on load', () => {
      cy.get('ion-datetime').should('have.prop', 'color', 'danger');
    });
  });

  describe('Input', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/input'));

    it('should update the form value', () => {
      cy.get('#formValue').should('have.text', JSON.stringify({
        inputString: '',
        inputNumber: ''
      }, null, 2));
      cy.get('ion-input[formControlName="inputString"]').should('have.class', 'ion-pristine');
      cy.get('ion-input[formControlName="inputNumber"]').should('have.class', 'ion-pristine');

      cy.get('ion-input[formControlName="inputString"]').should('have.class', 'ion-invalid');
      cy.get('ion-input[formControlName="inputNumber"]').should('have.class', 'ion-invalid');

      cy.get('ion-input[formControlName="inputString"] input').type('test');
      cy.get('ion-input[formControlName="inputString"] input').blur();

      cy.get('ion-input[formControlName="inputNumber"] input').type(1);
      cy.get('ion-input[formControlName="inputNumber"] input').blur();

      cy.get('#formValue').should('have.text', JSON.stringify({
        inputString: 'test',
        inputNumber: 1
      }, null, 2));

      cy.get('ion-input[formControlName="inputString"]').should('have.class', 'ion-dirty');
      cy.get('ion-input[formControlName="inputNumber"]').should('have.class', 'ion-dirty');

      cy.get('ion-input[formControlName="inputString"]').should('have.class', 'ion-valid');
      cy.get('ion-input[formControlName="inputNumber"]').should('have.class', 'ion-valid');

    });

    it('should proxy inputs on load', () => {
      cy.get('ion-input').first().should('have.prop', 'color', 'danger');
    });
  });

  describe('Radio Group', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/radio-group'));

    it('should update the form value', () => {
      cy.get('#formValue').should('have.text', JSON.stringify({ radioGroup: '1' }, null, 2));
      cy.get('ion-radio-group').should('have.class', 'ion-pristine');

      cy.get('ion-radio').contains('Two').click();

      cy.get('#formValue').should('have.text', JSON.stringify({ radioGroup: '2' }, null, 2));
      cy.get('ion-radio-group').should('have.class', 'ion-dirty');
      cy.get('ion-radio-group').should('have.class', 'ion-valid');
    });

    it('should proxy inputs on load', () => {
      cy.get('ion-radio').first().should('have.prop', 'color', 'danger');
    });
  });

  describe('Range', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/range'));

    it('should proxy inputs on load', () => {
      cy.get('ion-range').should('have.prop', 'color', 'danger');
    });
  });


  describe('Searchbar', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/searchbar'));

    it('should update the form value', () => {
      cy.get('#formValue').should('have.text', JSON.stringify({ searchbar: '' }, null, 2));
      cy.get('ion-searchbar').should('have.class', 'ion-pristine');
      cy.get('ion-searchbar').should('have.class', 'ion-invalid');

      cy.get('ion-searchbar').type('test');
      cy.get('ion-searchbar input').blur();

      cy.get('#formValue').should('have.text', JSON.stringify({ searchbar: 'test' }, null, 2));
      cy.get('ion-searchbar').should('have.class', 'ion-dirty');
      cy.get('ion-searchbar').should('have.class', 'ion-valid');
    });

    it('should proxy inputs on load', () => {
      cy.get('ion-searchbar').should('have.prop', 'color', 'danger');
    });
  });

  describe('Segment', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/segment'));

    it('should update the form value', () => {
      cy.get('#formValue').should('have.text', JSON.stringify({ segment: 'Paid' }, null, 2));
      cy.get('ion-segment').should('have.class', 'ion-pristine');

      cy.get('ion-segment-button').eq(1).click();

      cy.get('#formValue').should('have.text', JSON.stringify({ segment: 'Free' }, null, 2));
      cy.get('ion-segment').should('have.class', 'ion-dirty');
      cy.get('ion-segment').should('have.class', 'ion-valid');
    });

    it('should proxy inputs on load', () => {
      cy.get('ion-segment').should('have.prop', 'color', 'danger');
    });
  });

  describe('Select', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/select'));

    it('should update the form value', () => {
      cy.get('#formValue').should('have.text', JSON.stringify({ select: 'bananas' }, null, 2));
      cy.get('ion-select').should('have.class', 'ion-pristine');

      cy.get('ion-select').click();
      cy.get('ion-popover').should('be.visible');

      cy.get('ion-popover ion-radio-group ion-radio').first().click();

      cy.get('#formValue').should('have.text', JSON.stringify({ select: 'apples' }, null, 2));
      cy.get('ion-select').should('have.class', 'ion-dirty');
      cy.get('ion-select').should('have.class', 'ion-valid');
    });

    it('should proxy inputs on load', () => {
      cy.get('ion-select').should('have.prop', 'color', 'danger');
    });
  });

  describe('Textarea', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/textarea'));

    it('should update the form value', () => {
      cy.get('#formValue').should('have.text', JSON.stringify({ textarea: '' }, null, 2));
      cy.get('ion-textarea').should('have.class', 'ion-pristine');
      cy.get('ion-textarea').should('have.class', 'ion-invalid');

      cy.get('ion-textarea').click();
      cy.get('ion-textarea').type('test');

      cy.get('#formValue').should('have.text', JSON.stringify({ textarea: 'test' }, null, 2));
      cy.get('ion-textarea').should('have.class', 'ion-dirty');
      cy.get('ion-textarea').should('have.class', 'ion-valid');
    });

    it('should proxy inputs on load', () => {
      cy.get('ion-textarea').should('have.prop', 'color', 'danger');
    });
  });

  describe('Toggle', () => {
    beforeEach(() => cy.visit('/standalone/value-accessors/toggle'));

    it('should update the form value', () => {
      cy.get('#formValue').should('have.text', JSON.stringify({ toggle: false }, null, 2));
      cy.get('ion-toggle').should('have.class', 'ion-pristine');

      cy.get('ion-toggle').click();

      cy.get('#formValue').should('have.text', JSON.stringify({ toggle: true }, null, 2));
      cy.get('ion-toggle').should('have.class', 'ion-dirty');
      cy.get('ion-toggle').should('have.class', 'ion-valid');
    });

    it('should proxy inputs on load', () => {
      cy.get('ion-toggle').should('have.prop', 'color', 'danger');
    });
  });

});
