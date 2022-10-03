describe('useIonActionSheet', () => {
  beforeEach(() => {
    cy.visit('/overlay-hooks/actionsheet');
  });

  it('display action sheet using options', () => {
    //show action sheet
    cy.get('ion-button').contains('Show ActionSheet with options').click();
    cy.get('ion-action-sheet').contains('Action Sheet');
    cy.get('ion-action-sheet').get('button').contains('Ok');
    cy.get('ion-action-sheet').get('button').contains('Cancel');

    //click ok
    cy.get('ion-action-sheet').get('button:contains("Ok")').click();
    cy.get('div').contains('Ok clicked');
    cy.get('ion-action-sheet').should('not.exist');
  });

  it('display action sheet using params', () => {
    //show action sheet
    cy.get('ion-button').contains('Show ActionSheet with params').click();
    cy.get('ion-action-sheet').contains('Action Sheet');
    cy.get('ion-action-sheet').get('button').contains('Ok');
    cy.get('ion-action-sheet').get('button').contains('Cancel');

    //click ok
    cy.get('ion-action-sheet').get('button:contains("Ok")').click();
    cy.get('div').contains('Ok clicked');
    cy.get('ion-action-sheet').should('not.exist');
  });

  it('display action and call dismiss to close it', () => {
    //show action sheet
    cy.get('ion-button').contains('Show ActionSheet, hide after 250 ms').click();
    cy.get('ion-action-sheet').contains('Action Sheet');

    //verify action sheet is gone
    cy.get('ion-action-sheet').should('not.exist');
  });
});
