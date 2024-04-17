describe('useIonPicker', () => {
  beforeEach(() => {
    cy.visit('/overlay-hooks/picker');
  });

  it('display picker using options', () => {
    //show picker
    cy.get('ion-button').contains('Show Picker with options').click();
    cy.get('ion-picker-legacy').contains('Cat').click();
    cy.get('ion-picker-legacy button').contains('Confirm').click();
    cy.get('ion-picker-legacy').should('not.exist');

    //confirm value
    cy.get('div').contains('Selected Value: cat');
  });

  it('display picker using params', () => {
    //show picker
    cy.get('ion-button').contains('Show Picker with params').click();
    cy.get('ion-picker-legacy').contains('Bird').click();
    cy.get('ion-picker-legacy').contains('Bike').click();
    cy.get('ion-picker-legacy button').contains('Confirm').click();
    cy.get('ion-picker-legacy').should('not.exist');

    //confirm value
    cy.get('div').contains('Selected Value: bird, bike');
  });

  it('display picker and call dismiss to close it', () => {
    //show picker
    cy.get('ion-button').contains('Show Picker, hide after 250 ms').click();
    cy.get('ion-picker-legacy').contains('Cat');

    //verify picker is gone
    cy.get('ion-picker-legacy').should('not.exist');
  });
});
