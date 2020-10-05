describe.only('Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/navigation');
  })

 /*
 // TODO move these to separate describe block
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
  */

  it.only('should set query params and keep view in stack', () => {
    cy.get('#route-params').click();
    cy.ionPageVisible('navigation');
  })
});
