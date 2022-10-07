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
  });

  it('should have reset value', () => {
    cy.get('#reset-button').click();

    cy.get('ion-checkbox').should('have.prop', 'checked').and('equal', false);
    cy.get('ion-toggle').should('have.prop', 'checked').and('equal', false);
    cy.get('ion-input').should('have.prop', 'value').and('equal', '');
    cy.get('ion-datetime').should('have.prop', 'value').and('equal', '');
    cy.get('ion-select').should('have.prop', 'value').and('equal', '');
  });

  it('should get some value', () => {
    cy.get('#reset-button').click();
    cy.get('#set-button').click();

    cy.get('ion-checkbox').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-toggle').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-input').should('have.prop', 'value').and('equal', 'some text');
    cy.get('ion-datetime').should('have.prop', 'value').and('equal', '1994-03-15');
    cy.get('ion-select').should('have.prop', 'value').and('equal', 'nes');
  });

  it('change values should update angular', () => {
    cy.get('#reset-button').click();

    cy.get('ion-checkbox#first-checkbox').click();
    cy.get('ion-toggle').invoke('prop', 'checked', true);

    cy.get('ion-input').eq(0).type('hola');
    cy.get('ion-input input').eq(0).blur();

    cy.get('ion-datetime').invoke('prop', 'value', '1996-03-15');
    cy.get('ion-select').invoke('prop', 'value', 'playstation');

    cy.get('#checkbox-note').should('have.text', 'true');
    cy.get('#toggle-note').should('have.text', 'true');
    cy.get('#input-note').should('have.text', 'hola');
    cy.get('#datetime-note').should('have.text', '1996-03-15');
    cy.get('#select-note').should('have.text', 'playstation');
  });
});
