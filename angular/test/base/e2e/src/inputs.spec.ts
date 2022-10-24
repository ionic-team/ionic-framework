describe('Inputs', () => {
  beforeEach(() => {
    cy.visit('/inputs');
  })

  it('should have default value', () => {
    cy.get('ion-checkbox').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-toggle').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-input').should('have.prop', 'value').and('equal', 'some text');
    cy.get('ion-datetime').should('have.prop', 'value').and('equal', '1994-03-15');
    cy.get('ion-select').should('have.prop', 'value').and('equal', 'nes');
    cy.get('ion-range').should('have.prop', 'value').and('equal', 10);
  });

  it('should have reset value', () => {
    cy.get('#reset-button').click();

    cy.get('ion-checkbox').should('have.prop', 'checked').and('equal', false);
    cy.get('ion-toggle').should('have.prop', 'checked').and('equal', false);
    cy.get('ion-input').should('have.prop', 'value').and('equal', '');
    cy.get('ion-datetime').should('have.prop', 'value').and('equal', '');
    cy.get('ion-select').should('have.prop', 'value').and('equal', '');
    cy.get('ion-range').should('have.prop', 'value').and('be.NaN');
  });

  it('should get some value', () => {
    cy.get('#reset-button').click();
    cy.get('#set-button').click();

    cy.get('ion-checkbox').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-toggle').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-input').should('have.prop', 'value').and('equal', 'some text');
    cy.get('ion-datetime').should('have.prop', 'value').and('equal', '1994-03-15');
    cy.get('ion-select').should('have.prop', 'value').and('equal', 'nes');
    cy.get('ion-range').should('have.prop', 'value').and('equal', 10);
  });

  it('change values should update angular', () => {
    cy.get('#reset-button').click();

    cy.get('ion-checkbox').invoke('prop', 'checked', true);
    cy.get('ion-toggle').invoke('prop', 'checked', true);
    cy.get('ion-input').invoke('prop', 'value', 'hola');
    cy.get('ion-datetime').invoke('prop', 'value', '1996-03-15');
    cy.get('ion-select').invoke('prop', 'value', 'playstation');
    cy.get('ion-range').invoke('prop', 'value', 20);

    cy.get('#checkbox-note').should('have.text', 'true');
    cy.get('#toggle-note').should('have.text', 'true');
    cy.get('#input-note').should('have.text', 'hola');
    cy.get('#datetime-note').should('have.text', '1996-03-15');
    cy.get('#select-note').should('have.text', 'playstation');
    cy.get('#range-note').should('have.text', '20');
  });

  it('nested components should not interfere with NgModel', () => {
    cy.get('#range-note').should('have.text', '10');
    cy.get('#nested-toggle').click();
    cy.get('#range-note').should('have.text', '10');
  });
})
