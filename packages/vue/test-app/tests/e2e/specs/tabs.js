describe('Tabs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })

  it('should be able to create and destroy tabs', () => {
    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('home');

    cy.ionBackClick('tab1');
    cy.ionPageDoesNotExist('tabs');

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('home');

    cy.ionBackClick('tab1');
    cy.ionPageDoesNotExist('tabs');
  });

  it('should go back from a tabs page to a non-tabs page using ion-back-button', () => {
    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');

    cy.ionBackClick('tab2');
    cy.ionPageVisible('home')
    cy.ionPageDoesNotExist('tabs');
  });

  it('should properly clear stack when leaving tabs', () => {
    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');

    cy.ionBackClick('tab2');
    cy.ionPageVisible('home')
    cy.ionPageDoesNotExist('tabs');

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
  });
})
