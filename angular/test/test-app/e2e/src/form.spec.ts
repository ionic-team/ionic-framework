describe('Form', () => {
  beforeEach(() => {
    cy.visit('/form');
  })

  describe('status updates', () => {
    it('should update Ionic form classes when calling form methods programmatically', async () => {
      cy.get('#input-touched').click();
      cy.get('#touched-input-test').should('have.class', 'ion-touched');
    });
  });

  describe('change', () => {
    it('should have default values', () => {
      testStatus('INVALID');
      cy.get('#submit').should('have.text', 'false');
      testData({
        datetime: '2010-08-20',
        select: null,
        toggle: false,
        input: '',
        input2: 'Default Value',
        checkbox: false,
        range: 5
      });
    });

    it('should become valid', () => {
      cy.get('ion-input.required').invoke('prop', 'value', 'Some value');
      testStatus('INVALID');

      cy.get('ion-select').invoke('prop', 'value', 'nes');
      testStatus('INVALID');

      cy.get('ion-range').invoke('prop', 'value', 40);
      testStatus('VALID');

      testData({
        datetime: '2010-08-20',
        select: 'nes',
        toggle: false,
        input: 'Some value',
        input2: 'Default Value',
        checkbox: false,
        range: 40
      });
    });

    it('ion-toggle should change', () => {
      cy.get('form ion-toggle').click();
      testData({
        datetime: '2010-08-20',
        select: null,
        toggle: true,
        input: '',
        input2: 'Default Value',
        checkbox: false,
        range: 5
      });
    });

    it('ion-checkbox should change', () => {
      cy.get('ion-checkbox').click();
      testData({
        datetime: '2010-08-20',
        select: null,
        toggle: false,
        input: '',
        input2: 'Default Value',
        checkbox: true,
        range: 5
      });
    });

    it('should submit', () => {
      cy.get('#set-values').click();
      cy.get('#submit-button').click();
      cy.get('#submit').should('have.text', 'true');
    });
  });

  describe('blur', () => {
    it('ion-toggle should change only after blur', () => {
      cy.get('form ion-toggle').click();
      testData({
        datetime: '2010-08-20',
        select: null,
        toggle: true,
        input: '',
        input2: 'Default Value',
        checkbox: false,
        range: 5
      });
      cy.get('ion-checkbox').click();
      testData({
        datetime: '2010-08-20',
        select: null,
        toggle: true,
        input: '',
        input2: 'Default Value',
        checkbox: true,
        range: 5
      });
    });
  });
});

function testStatus(status) {
  cy.get('#status').should('have.text', status);
}

function testData(data) {
  cy.get('#data').invoke('text').then(text => {
    const value = JSON.parse(text);
    console.log(value, data);
    expect(value).to.deep.equal(data);
  })
}
