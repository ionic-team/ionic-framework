describe('IonModal', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/modal');
  });

  it('display modal', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal').click();
    cy.get('ion-modal ion-title').contains('My Modal');

    //increment count
    cy.get('ion-button').contains('Increment Count').click();
    cy.get('ion-button').contains('Increment Count').click();
    cy.get('ion-modal').contains('Count in modal: 2');

    //close modal
    cy.get('ion-button').contains('Close').click();

    //verify count on main page was updated
    cy.contains('Count: 2');
  });

  it('display modal and call dismiss to close it', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal, hide after 250 ms').click();
    cy.get('ion-modal ion-title').contains('My Modal');
  });

  it('display modal with context', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal with Context').click();

    //verify context value is overriden value
    cy.get('ion-modal div').contains('overriden value')
  });
});
