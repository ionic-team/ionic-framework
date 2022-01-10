describe('Modals', () => {
  beforeEach(() => {
    cy.visit('/modals');
  })

  it('should open standalone modal and close', () => {
    cy.get('#action-button').click();

    cy.get('ion-modal').should('exist').should('be.visible');

    cy.get('app-modal-example h2').should('have.text', '123');
    cy.get('app-modal-example h3').should('have.text', '321');

    cy.get('#onWillDismiss').should('have.text', 'false');
    cy.get('#onDidDismiss').should('have.text', 'false');

    cy.get('#close-modal').click();

    cy.get('ion-modal').should('not.exist');

    cy.get('#onWillDismiss').should('have.text', 'true');
    cy.get('#onDidDismiss').should('have.text', 'true');
  });

  it('should open nav modal and close', () => {
    cy.get('#action-button-2').click();

    cy.get('ion-modal').should('exist').should('be.visible');

    cy.get('ion-nav > *:last-child h2').should('have.text', '123');
    cy.get('ion-nav > *:last-child h3').should('have.text', '321');

    cy.get('ion-nav > *:last-child .push-page').click();

    cy.get('ion-nav > *:last-child h2').should('have.text', 'pushed!');
    cy.get('ion-nav > *:last-child h3').should('have.text', '');

    cy.get('ion-nav > *:last-child .pop-page').click();

    cy.get('ion-nav > *:last-child h2').should('have.text', '123');
  });

});


describe('Modals: Inline', () => {
  beforeEach(() => {
    cy.visit('/modal-inline');
  });

  it('should initially have no items', () => {
    cy.get('ion-list ion-item').should('not.exist');
  });

  it('should have items after 1500ms', () => {
    cy.wait(1500);

    cy.get('ion-list ion-item:nth-child(1)').should('have.text', 'A');
    cy.get('ion-list ion-item:nth-child(2)').should('have.text', 'B');
    cy.get('ion-list ion-item:nth-child(3)').should('have.text', 'C');
    cy.get('ion-list ion-item:nth-child(4)').should('have.text', 'D');
  });
});
