describe('Tabs', () => {
  it('should go back from child pages', () => {
    cy.visit('http://localhost:8080/tabs')

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
    cy.visit('http://localhost:8080/tabs')

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

  it('should return to tab root when clicking tab button', () => {
    cy.visit('http://localhost:8080/tabs')

    cy.get('#child-one').click();
    cy.get('#child-two').click();

    cy.get('ion-tab-button#tab-button-tab1').click();

    cy.ionPageVisible('tab1');
    // TODO this page is not removed
    //cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageDoesNotExist('tab1childtwo');
  })

  it('should be able to create and destroy tabs', () => {
    cy.visit('http://localhost:8080')

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
