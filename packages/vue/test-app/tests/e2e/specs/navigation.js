describe('Navigation', () => {
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
    cy.visit('http://localhost:8080/default-href');

    cy.ionBackClick('defaulthref');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('defaulthref');
  });

  it('should show back button', () => {
    cy.visit('http://localhost:8080');

    cy.get('#navigation').click();
    cy.get('#child').click();

    cy.ionBackClick('navigationchild');
    cy.ionBackClick('navigation');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('navigation');
    cy.ionPageDoesNotExist('navigationchild')
  })
});

describe('Navigation - Swipe to Go Back', () => {
  beforeEach(() => {
    cy.viewport(320, 568);
    cy.visit('http://localhost:8080?ionic:mode=ios');
    cy.get('#navigation').click();
    cy.ionPageHidden('home');
    cy.ionPageVisible('navigation')
  });

  it('should swipe and abort', () => {
    cy.ionSwipeToGoBack();
    cy.ionPageHidden('home');
    cy.ionPageVisible('navigation');
  });

  it('should swipe and complete', () => {
    cy.ionSwipeToGoBack(true);
    cy.ionPageVisible('home');

    // TODO: Vue router does not go back in cypress with router.back()
    //cy.ionPageDoesNotExist('navigation');
  });
})
