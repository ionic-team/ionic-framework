describe('Inputs', () => {
  beforeEach(() => {
    cy.visit('/lazy/inputs');
  })

  it('should have default value', () => {
    cy.get('ion-checkbox').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-radio-group').should('have.prop', 'value').and('equal', 'nes');
    cy.get('ion-toggle').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-input').should('have.prop', 'value').and('equal', 'some text');
    cy.get('ion-datetime').should('have.prop', 'value').and('equal', '1994-03-15');
    cy.get('ion-select').should('have.prop', 'value').and('equal', 'nes');
    cy.get('ion-range').should('have.prop', 'value').and('equal', 50);
  });

  it('should have reset value', () => {
    cy.get('#reset-button').click();

    cy.get('ion-checkbox').should('have.prop', 'checked').and('equal', false);
    cy.get('ion-radio-group').should('not.have.prop', 'value');
    cy.get('ion-toggle').should('have.prop', 'checked').and('equal', false);
    /**
     * The `value` property gets set to undefined
     * for these components, so we need to check
     * not.have.prop which will check that the
     * value property is undefined.
     */
    cy.get('ion-input').should('not.have.prop', 'value');
    cy.get('ion-datetime').should('not.have.prop', 'value');
    cy.get('ion-select').should('not.have.prop', 'value');
    cy.get('ion-range').should('not.have.prop', 'value');
  });

  it('should get some value', () => {
    cy.get('#reset-button').click();
    cy.get('#set-button').click();

    cy.get('ion-checkbox').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-radio-group').should('have.prop', 'value').and('equal', 'nes');
    cy.get('ion-toggle').should('have.prop', 'checked').and('equal', true);
    cy.get('ion-input').should('have.prop', 'value').and('equal', 'some text');
    cy.get('ion-datetime').should('have.prop', 'value').and('equal', '1994-03-15');
    cy.get('ion-select').should('have.prop', 'value').and('equal', 'nes');
    cy.get('ion-range').should('have.prop', 'value').and('equal', 50);
  });

  it('change values should update angular', () => {
    cy.get('#reset-button').click();

    cy.get('ion-checkbox#first-checkbox').click();
    cy.get('ion-radio').first().click();
    cy.get('ion-toggle').first().click();

    cy.get('ion-input').eq(0).type('hola');
    cy.get('ion-input input').eq(0).blur();

    // Set date to 1994-03-14
    cy.get('ion-datetime').first().shadow().find('.calendar-day:not([disabled])').first().click();

    cy.get('ion-select#game-console').click();
    cy.get('ion-alert').should('exist').should('be.visible');
    // Playstation option
    cy.get('ion-alert .alert-radio-button:nth-of-type(4)').click();
    // Click confirm button
    cy.get('ion-alert .alert-button:not(.alert-button-role-cancel)').click();

    cy.get('#checkbox-note').should('have.text', 'true');
    cy.get('#radio-note').should('have.text', 'nes');
    cy.get('#toggle-note').should('have.text', 'true');
    cy.get('#input-note').should('have.text', 'hola');
    cy.get('#datetime-note').should('have.text', '1994-03-14');
    cy.get('#select-note').should('have.text', 'ps');
  });
});
