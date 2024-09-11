describe('RouterLink', () => {
  beforeEach(() => {
    cy.visit('/standalone/router-link');
  });

  it('should mount the root component', () => {
    cy.ionPageVisible('app-router-link');

    cy.contains('I\'m a link');
  });

  it('should go to /standalone/popover using an anchor', () => {
    // click on the anchor
    cy.get('a').contains('I\'m a link').click();

    cy.url().should('include', '/standalone/popover');
  });

  it('should go to /standalone/popover using a button', () => {
    cy.get('button').contains('I\'m a button').click();

    cy.url().should('include', '/standalone/popover');
  });

  // Angular sets the `tabindex` to `"0"` on any element that uses
  // the `routerLink` directive. Ionic removes the `tabindex` from
  // components that wrap an `a` or `button` element, so we are
  // checking here that it is only removed from Ionic components.
  // https://github.com/ionic-team/ionic-framework/issues/20632
  it('should have tabindex="0" with a native span', () => {
    cy.get('span').should('have.attr', 'tabindex', '0');
  });

  it('should not have tabindex set with an ionic button', () => {
    cy.get('ion-button').should('not.have.attr', 'tabindex');
  });
});
