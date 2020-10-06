describe.only('Navigation', () => {

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

  it('should go to sibling page', () => {
    cy.visit('http://localhost:8080');
    cy.get('ion-item#navigation').click();

    cy.wait(500)

    cy.ionPageVisible('navigation')
    cy.ionPageHidden('home')
  });

  it('should set query params and keep view in stack', () => {
    cy.visit('http://localhost:8080/navigation');
    cy.get('#route-params').click();
    cy.ionPageVisible('navigation');
  });

  it('should go back home', () => {
    cy.visit('http://localhost:8080');
    cy.get('ion-item#navigation').click();

    cy.ionBackClick('navigation');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('navigation');
  });

  it('should go back home with default href', () => {
    cy.visit('http://localhost:8080/navigation');

    cy.ionBackClick('navigation');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('navigation');
  });
});
