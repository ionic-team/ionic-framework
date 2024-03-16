describe('useIonModal', () => {
  beforeEach(() => {
    cy.visit('/overlay-hooks/modal');
  });

  it('display modal using component param', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal using component param').click();
    cy.get('ion-modal ion-title').contains('My Component Modal');

    //increment count
    cy.get('ion-button').contains('Increment Count').click();
    cy.get('ion-button').contains('Increment Count').click();
    cy.get('ion-modal').contains('Count in modal: 2');

    //close modal
    cy.get('ion-button').contains('Close').click();
    cy.get('ion-modal').should('not.exist');

    //verify count on main page was updated
    cy.contains('Count: 2');
  });

  it('display modal using element param', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal using element param').click();
    cy.get('ion-modal ion-title').contains('My Element Modal');

    //increment count
    cy.get('ion-button').contains('Increment Count').click();
    cy.get('ion-button').contains('Increment Count').click();
    cy.get('ion-modal').contains('Count in modal: 2');

    //close modal
    cy.get('ion-button').contains('Close').click();
    cy.get('ion-modal').should('not.exist');

    //verify count on main page was updated
    cy.contains('Count: 2');
  });

  it('display modal and call dismiss to close it', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal, hide after 250 ms').click();
    cy.get('ion-modal ion-title').contains('My Element Modal');

    //verify modal is gone
    cy.get('ion-modal').should('not.exist');
  });

  it('display modal and dismiss with data and role', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal using component param').click();

    //close modal
    cy.get('ion-button').contains('Close').click();
    cy.get('ion-modal').should('not.exist');

    //verify role and data on main page was updated
    cy.contains('Dismissed with role: close');
    cy.contains('Data: {"test":true}');
  });

  // This test should pass in v6, skipping until merged with v6
  it.skip('display modal with context', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal with Context').click();
    cy.get('ion-modal ion-title').contains('My Element Modal');

    //verify context value is overriden value
    cy.get('div').contains('overriden value')
  });

  it('should render nested modal when modals are added and removed at the same time', () => {
    cy.get('#show-root-modal').click();

    cy.get('ion-modal').should('have.length', 1);

    cy.get('ion-modal #show-secondary-modal').click();

    cy.get('ion-modal').should('have.length', 1);

    cy.get('ion-modal').contains('This text should be visible');
  });
});
