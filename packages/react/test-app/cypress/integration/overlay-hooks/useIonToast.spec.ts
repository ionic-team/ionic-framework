describe('useIonToast', () => {
  beforeEach(() => {
    cy.visit('/overlay-hooks/toast');
  });

  it('display toast using options', () => {
    //show toast
    cy.get('ion-button').contains('Show Toast with options').click();
    cy.get('ion-toast');
    cy.get('ion-toast').shadow().contains('toast from hook, click hide to dismiss');
    cy.get('ion-toast').shadow().find('button').contains('hide').click();
    cy.get('ion-toast').should('not.exist');
  });

  it('display toast using params', () => {
    cy.get('ion-button').contains('Show Toast Hook with params, closes in 250 ms').click();
    cy.get('ion-toast');
    cy.get('ion-toast').shadow().contains('Hello from a toast!');
    cy.get('ion-toast').should('not.exist');
  });

  it('display toast and call dismiss to close it', () => {
    //show toast
    cy.get('ion-button').contains('Show Toast Hook with params, call dismiss in 250 ms').click();
     cy.get('ion-toast');
     cy.get('ion-toast').shadow().contains('Hello from a toast!');
     cy.get('ion-toast').should('not.exist');
  });
});
