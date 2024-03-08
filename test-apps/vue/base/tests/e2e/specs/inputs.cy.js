describe('Inputs', () => {
  beforeEach(() => {
    cy.visit('/inputs')
  })
  it('should have default value', () => {
    cy.get('ion-checkbox').should('have.prop', 'checked').and('eq', false);
    cy.get('ion-toggle').should('have.prop', 'checked').and('eq', false);
    cy.get('ion-input').should('have.prop', 'value').and('eq', '');
    cy.get('ion-range').should('have.prop', 'value').and('deep.eq', { lower: 30, upper: 70 });
    cy.get('ion-textarea').should('have.prop', 'value').and('eq', '');
    cy.get('ion-searchbar').should('have.prop', 'value').and('eq', '');
    cy.get('ion-datetime').should('have.prop', 'value').and('eq', '');
    cy.get('ion-radio-group').should('have.prop', 'value').and('eq', 'red');
    cy.get('ion-segment').should('have.prop', 'value').and('eq', 'dogs');
    cy.get('ion-select').should('have.prop', 'value').and('eq', 'apples');
  });

  it('should set/reset values', () => {
    cy.get('ion-button#set').click();

    cy.get('ion-checkbox').should('have.prop', 'checked').and('eq', true);
    cy.get('ion-toggle').should('have.prop', 'checked').and('eq', true);
    cy.get('ion-input').should('have.prop', 'value').and('eq', 'Hello World');
    cy.get('ion-range').should('have.prop', 'value').and('deep.eq', { lower: 10, upper: 90 });
    cy.get('ion-textarea').should('have.prop', 'value').and('eq', 'Lorem Ipsum');
    cy.get('ion-searchbar').should('have.prop', 'value').and('eq', 'Search Query');
    cy.get('ion-datetime').should('have.prop', 'value').and('eq', '2019-01-31');
    cy.get('ion-radio-group').should('have.prop', 'value').and('eq', 'blue');
    cy.get('ion-segment').should('have.prop', 'value').and('eq', 'cats');
    cy.get('ion-select').should('have.prop', 'value').and('eq', 'bananas');

    cy.get('ion-button#reset').click();

    cy.get('ion-checkbox').should('have.prop', 'checked').and('eq', false);
    cy.get('ion-toggle').should('have.prop', 'checked').and('eq', false);
    cy.get('ion-input').should('have.prop', 'value').and('eq', '');
    cy.get('ion-range').should('have.prop', 'value').and('deep.eq', { lower: 30, upper: 70 });
    cy.get('ion-textarea').should('have.prop', 'value').and('eq', '');
    cy.get('ion-searchbar').should('have.prop', 'value').and('eq', '');
    cy.get('ion-datetime').should('have.prop', 'value').and('eq', '');
    cy.get('ion-radio-group').should('have.prop', 'value').and('eq', 'red');
    cy.get('ion-segment').should('have.prop', 'value').and('eq', 'dogs');
    cy.get('ion-select').should('have.prop', 'value').and('eq', 'apples');
  });

  describe('updating text input refs', () => {
    it('typing into input should update ref', () => {
      cy.get('ion-input input').type('Hello Input', { scrollBehavior: false });

      cy.get('#input-ref').should('have.text', 'Hello Input');
    });
    it('typing into searchbar should update ref', () => {
      cy.get('ion-searchbar input').type('Hello Searchbar', { scrollBehavior: false });

      cy.get('#searchbar-ref').should('have.text', 'Hello Searchbar');
    });
    it('typing into textarea should update ref', () => {
      cy.get('ion-textarea textarea').type('Hello Textarea', { scrollBehavior: false });

      cy.get('#textarea-ref').should('have.text', 'Hello Textarea');
    });
  });
})
