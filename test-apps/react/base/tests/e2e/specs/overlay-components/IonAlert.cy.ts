describe('IonAlert', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/alert');
  });

  it('display alert', () => {
    //show alert
    cy.get('ion-button').contains('Show Alert').click();
    cy.get('ion-alert').contains('Alert');
    cy.get('ion-alert').get('button').contains('Ok');
    cy.get('ion-alert').get('button').contains('Cancel');

    //click ok
    cy.get('ion-alert').get('button:contains("Ok")').click();
    cy.get('div').contains('Ok clicked');
    cy.get('ion-alert').should('not.be.visible');
  });

  it('display alert and call dismiss to close it', () => {
    //show alert
    cy.get('ion-button').contains('Show Alert, hide after 250 ms').click();
    cy.get('ion-alert').contains('Alert');

    //verify alert is gone
    cy.get('ion-alert').should('not.be.visible');
  });
});
