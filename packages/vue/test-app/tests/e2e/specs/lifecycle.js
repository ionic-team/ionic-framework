describe('Lifecycle', () => {
  it('should fire lifecycle events when navigating to and from a page', () => {
    cy.visit('http://localhost:8080');
    cy.get('#lifecycle').click();

    testLifecycle('lifecycle', {
      ionViewWillEnter: 1,
      ionViewDidEnter: 1,
      ionViewWillLeave: 0,
      ionViewDidLeave: 0,
      onIonViewWillEnter: 1,
      onIonViewDidEnter: 1,
      onIonViewWillLeave: 0,
      onIonViewDidLeave: 0
    });

    cy.get('#lifecycle-navigation').click();

    testLifecycle('lifecycle', {
      ionViewWillEnter: 1,
      ionViewDidEnter: 1,
      ionViewWillLeave: 1,
      ionViewDidLeave: 1,
      onIonViewWillEnter: 1,
      onIonViewDidEnter: 1,
      onIonViewWillLeave: 1,
      onIonViewDidLeave: 1
    });

    cy.ionBackClick('navigation');

    testLifecycle('lifecycle', {
      ionViewWillEnter: 2,
      ionViewDidEnter: 2,
      ionViewWillLeave: 1,
      ionViewDidLeave: 1,
      onIonViewWillEnter: 2,
      onIonViewDidEnter: 2,
      onIonViewWillLeave: 1,
      onIonViewDidLeave: 1
    });
  });

  it('should fire lifecycle events when landed on directly', () => {
    cy.visit('http://localhost:8080/lifecycle');

    testLifecycle('lifecycle', {
      ionViewWillEnter: 1,
      ionViewDidEnter: 1,
      ionViewWillLeave: 0,
      ionViewDidLeave: 0,
      onIonViewWillEnter: 1,
      onIonViewDidEnter: 1,
      onIonViewWillLeave: 0,
      onIonViewDidLeave: 0
    });
  });
})

const testLifecycle = (selector, expected = {}) => {
  cy.get(`[data-pageid=${selector}] #willEnter`).should('have.text', expected.ionViewWillEnter);
  cy.get(`[data-pageid=${selector}] #didEnter`).should('have.text', expected.ionViewDidEnter);
  cy.get(`[data-pageid=${selector}] #willLeave`).should('have.text', expected.ionViewWillLeave);
  cy.get(`[data-pageid=${selector}] #didLeave`).should('have.text', expected.ionViewDidLeave);

  cy.get(`[data-pageid=${selector}] #onWillEnter`).should('have.text', expected.onIonViewWillEnter);
  cy.get(`[data-pageid=${selector}] #onDidEnter`).should('have.text', expected.onIonViewDidEnter);
  cy.get(`[data-pageid=${selector}] #onWillLeave`).should('have.text', expected.onIonViewWillLeave);
  cy.get(`[data-pageid=${selector}] #onDidLeave`).should('have.text', expected.onIonViewDidLeave);
}
