describe('IonActionSheet', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/actionsheet');
  });

  it('display action sheet', () => {
    //show action sheet
    cy.get('ion-button').contains('Show ActionSheet').click();
    cy.get('ion-action-sheet').contains('Action Sheet');
    cy.get('ion-action-sheet').get('button').contains('Ok');
    cy.get('ion-action-sheet').get('button').contains('Cancel');

    //click ok
    cy.get('ion-action-sheet').get('button:contains("Ok")').click();
    cy.get('div').contains('Ok clicked');
    cy.get('ion-action-sheet').should('not.be.visible');
  });

  it('display action and call dismiss to close it', () => {
    //show action sheet
    cy.get('ion-button').contains('Show ActionSheet, hide after 250 ms').click();
    cy.get('ion-action-sheet').contains('Action Sheet');

    //verify action sheet is hidden
    cy.get('ion-action-sheet').should('not.be.visible');
  });
});
