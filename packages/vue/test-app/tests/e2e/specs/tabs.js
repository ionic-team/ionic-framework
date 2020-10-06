describe('Tabs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/tabs')
  })
  it('should go back from child pages', () => {
    cy.get('#child-one').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1childone');

    cy.get('#child-two').click();
    cy.ionPageHidden('tab1childone');
    cy.ionPageVisible('tab1childtwo');

    cy.ionBackClick('tab1childtwo');
    cy.ionBackClick('tab1childone');

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageDoesNotExist('tab1childtwo');
  });

  it('should go back to child page when switching tabs', () => {
    cy.get('#child-one').click();

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1childone');

    cy.get('ion-tab-button#tab-button-tab1').click();

    cy.ionPageHidden('tab2');
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1childone');

    cy.get('ion-tab-button#tab-button-tab1').click();
  });

  // TODO this does not work
  it.skip('should return to tab root when clicking tab button', () => {
    cy.get('#child-one').click();
    cy.get('#child-two').click();

    cy.get('ion-tab-button#tab-button-tab1').click();

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageDoesNotExist('tab1childtwo');
  });
})
