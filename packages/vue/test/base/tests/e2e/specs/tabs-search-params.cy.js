/**
 * Verifies that query params set on an IonTabButton href are preserved when
 * the tab is activated (first visit, switching tabs, switching back, and
 * re-clicking the already-active tab).
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/25470
 */
describe('Tabs: query params on tab button href', () => {
  it('should preserve query params on first visit to a tab', () => {
    cy.visit('/tabs-search-params/tab1?foo=bar');

    cy.ionPageVisible('tabs-search-params-tab1');
    cy.location('pathname').should('eq', '/tabs-search-params/tab1');
    cy.location('search').should('eq', '?foo=bar');
    cy.get('[data-testid="tab1-foo"]').should('have.text', 'bar');
    cy.get('ion-tab-button[data-testid="tab1"]').should('have.class', 'tab-selected');
  });

  it('should preserve href query params when switching to a tab for the first time', () => {
    cy.visit('/tabs-search-params/tab1?foo=bar');
    cy.ionPageVisible('tabs-search-params-tab1');

    cy.get('ion-tab-button[data-testid="tab2"]').click();
    cy.ionPageVisible('tabs-search-params-tab2');

    cy.location('pathname').should('eq', '/tabs-search-params/tab2');
    cy.location('search').should('eq', '?baz=qux');
    cy.get('[data-testid="tab2-baz"]').should('have.text', 'qux');
    cy.get('ion-tab-button[data-testid="tab2"]').should('have.class', 'tab-selected');
  });

  it('should preserve query params when switching back to a previously visited tab', () => {
    cy.visit('/tabs-search-params/tab1?foo=bar');
    cy.ionPageVisible('tabs-search-params-tab1');

    cy.get('ion-tab-button[data-testid="tab2"]').click();
    cy.ionPageVisible('tabs-search-params-tab2');

    cy.get('ion-tab-button[data-testid="tab1"]').click();
    cy.ionPageVisible('tabs-search-params-tab1');

    cy.location('pathname').should('eq', '/tabs-search-params/tab1');
    cy.location('search').should('eq', '?foo=bar');
    cy.get('[data-testid="tab1-foo"]').should('have.text', 'bar');
  });

  it('should preserve query params when re-clicking the already-active tab', () => {
    cy.visit('/tabs-search-params/tab1?foo=bar');
    cy.ionPageVisible('tabs-search-params-tab1');

    cy.get('ion-tab-button[data-testid="tab1"]').click();

    cy.location('pathname').should('eq', '/tabs-search-params/tab1');
    cy.location('search').should('eq', '?foo=bar');
    cy.get('[data-testid="tab1-foo"]').should('have.text', 'bar');
  });
});
