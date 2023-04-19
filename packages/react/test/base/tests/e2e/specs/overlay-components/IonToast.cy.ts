describe('IonToast', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/toast');
  });

  it('display toast', () => {
    //show toast
    cy.get('ion-button').contains('Show Toast').click();
    cy.get('ion-toast');
    cy.get('ion-toast').shadow().contains('Hello from a toast!');
    cy.get('ion-toast').shadow().find('button').contains('hide').click();
    cy.get('ion-toast').should('not.be.visible');
  });

  it('display toast and call dismiss to close it', () => {
    //show toast
    cy.get('ion-button').contains('Show Toast, call dismiss in 250 ms').click();
     cy.get('ion-toast');
     cy.get('ion-toast').shadow().contains('Hello from a toast!');
     cy.get('ion-toast').should('not.be.visible');
  });
});
