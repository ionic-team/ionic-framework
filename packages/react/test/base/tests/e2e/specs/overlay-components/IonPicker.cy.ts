describe('IonPicker', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/picker');
  });

  it('display picker', () => {
    //show picker
    cy.get('ion-button').contains('Show Picker').click();
    cy.get('ion-picker').contains('Bird').click();
    cy.get('ion-picker').contains('Bike').click();
    cy.get('ion-picker button').contains('Confirm').click();
    cy.get('ion-picker').should('not.be.visible');

    //confirm value
    cy.get('div').contains('Selected Value: bird, bike');
  });

  it('display picker and call dismiss to close it', () => {
    //show picker
    cy.get('ion-button').contains('Show Picker, hide after 250 ms').click();
    cy.get('ion-picker').contains('Cat');

    //verify picker is gone
    cy.get('ion-picker').should('not.be.visible');
  });
});
