describe('Hardware Back Button', () => {
  it('should correctly go back to Tab 1', () => {
    cy.visit('http://localhost:8080/tabs');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab2');

    cy.get('#add-tab').click();

    cy.get('ion-tab-button#tab-button-tab4').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab4');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab4');
    cy.ionPageVisible('tab1');

    cy.hardwareBackButton();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab4');

    cy.hardwareBackButton();
    cy.ionPageHidden('tab4');
    cy.ionPageVisible('tab2');

    cy.hardwareBackButton();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1');
  });
})
