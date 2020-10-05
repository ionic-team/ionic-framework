describe('Inputs', () => {
  beforeEach(() => {
    cy.viewport(320, 568);
    cy.visit('http://localhost:8080?ionic:mode=ios');
    cy.get('#navigation').click();
    cy.wait(500);
  })

  it.skip('should swipe and abort', () => {
    cy.ionPageInvisible('home');
    cy.ionSwipeToGoBack();
    cy.ionPageInvisible('home');
    cy.ionPageVisible('navigation');
  });

  it.skip('should swipe and complete', () => {
    cy.ionSwipeToGoBack(true);
    cy.ionPageVisible('home');
  });
});
