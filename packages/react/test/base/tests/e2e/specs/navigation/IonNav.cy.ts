describe('IonNav', () => {
  beforeEach(() => {
    cy.visit('/navigation');
  });

  it('should render the root page', () => {
    cy.get('ion-nav').contains('Page one content');
  });

  it('should have a ref defined', () => {
    cy.get('#navRef').should('have.text', 'Nav ref is defined: true');
  });

  it('should push a page', () => {
    cy.get('ion-button').contains('Go to Page Two').click();
    cy.get('#pageTwoContent').should('be.visible');
    cy.get('ion-nav').contains('Page two content');

    cy.get('ion-nav .ion-page').should('have.length', 2);
  });

  it('should pop a page', () => {
    cy.get('ion-button').contains('Go to Page Two').click();

    cy.get('#pageTwoContent').should('be.visible');
    cy.get('ion-nav').contains('Page two content');

    cy.get('ion-nav .ion-page').should('have.length', 2);

    cy.get('.ion-page.can-go-back ion-back-button').click();

    cy.get('#pageOneContent').should('be.visible');
    cy.get('ion-nav').contains('Page one content');

    cy.get('ion-nav .ion-page').should('have.length', 1);
  });

  it('should pass params to the page', () => {
    cy.get('#pageOneProps').should('have.text', '{"someString":"Hello","someNumber":3,"someBoolean":true}');
  });

  it('should pass componentProps to sub pages', () => {
    cy.get('ion-button').contains('Go to Page Two').click();

    cy.get('#pageTwoContent').should('be.visible');

    cy.get('#pageTwoProps').should('have.text', '{"someValue":"Hello"}');
  });

  it('should unmount pages when popping to root', () => {
    // Issue: https://github.com/ionic-team/ionic-framework/issues/27798

    cy.contains('Go to Page Two').click();
    cy.get('#pageTwoContent').should('be.visible');

    cy.contains('Go to Page Three').click();
    cy.get('#pageThreeContent').should('be.visible');

    cy.window().then((window) => {
      window.addEventListener('pageThreeUnmounted', cy.stub().as('pageThreeUnmounted'));
    });

    cy.get('ion-button').contains('popToRoot').click();
    cy.get('#pageThreeContent').should('not.exist');

    cy.get('@pageThreeUnmounted').should('have.been.calledOnce');
  });

});
