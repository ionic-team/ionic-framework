describe('Routing', () => {

 /*
 // TODO move these to separate describe block
 it.skip('should swipe and abort', () => {
    cy.ionPageInvisible('home');
    cy.ionSwipeToGoBack();
    cy.ionPageInvisible('home');
    cy.ionPageVisible('routing');
  });

  it.skip('should swipe and complete', () => {
    cy.ionSwipeToGoBack(true);
    cy.ionPageVisible('home');
  });
  */

  it('should go to sibling page', () => {
    cy.visit('http://localhost:8080');
    cy.get('ion-item#routing').click();

    cy.wait(500)

    cy.ionPageVisible('routing')
    cy.ionPageHidden('home')
  });

  it('should set query params and keep view in stack', () => {
    cy.visit('http://localhost:8080/routing');
    cy.get('#route-params').click();
    cy.ionPageVisible('routing');
  });

  it('should go back home', () => {
    cy.visit('http://localhost:8080');
    cy.get('ion-item#routing').click();

    cy.ionBackClick('routing');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');
  });

  it('should go back home with default href', () => {
    cy.visit('http://localhost:8080/default-href');

    cy.ionBackClick('defaulthref');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('defaulthref');
  });

  it('should show back button', () => {
    cy.visit('http://localhost:8080');

    cy.get('#routing').click();
    cy.get('#child').click();

    cy.ionBackClick('routingchild');
    cy.ionBackClick('routing');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');
    cy.ionPageDoesNotExist('routingchild')
  })
});
