describe('useIonAlert', () => {
  beforeEach(() => {
    cy.visit('/overlay-hooks/alert');
  });

  it('display alert using options', () => {
    //show alert
    cy.get('ion-button').contains('Show Alert with options').click();
    cy.get('ion-alert').contains('Alert');
    cy.get('ion-alert').get('button').contains('Ok');
    cy.get('ion-alert').get('button').contains('Cancel');

    //click ok
    cy.get('ion-alert').get('button:contains("Ok")').click();
    cy.get('div').contains('Ok clicked');
    cy.get('ion-alert').should('not.exist');
  });

  it('display alert using params', () => {
    //show alert
    cy.get('ion-button').contains('Show Alert with params').click();
    cy.get('ion-alert').contains('Hello!');
    cy.get('ion-alert').get('button').contains('Ok');

    //click ok
    cy.get('ion-alert').get('button:contains("Ok")').click();
    cy.get('div').contains('Ok clicked');
    cy.get('ion-alert').should('not.exist');
  });

  it('display alert and call dismiss to close it', () => {
    //show alert
    cy.get('ion-button').contains('Show Alert, hide after 250 ms').click();
    cy.get('ion-alert').contains('Hello!');

    //verify alert is gone
    cy.get('ion-alert').should('not.exist');
  });
});
