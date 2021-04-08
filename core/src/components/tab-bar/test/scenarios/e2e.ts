describe('tab-bar: scenarios', () => {
  beforeEach(() => {
    cy.visit('components/tab-bar/test/scenarios?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-tab-bar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('tab-bar: scenarios, rtl', () => {
  beforeEach(() => {
    cy.visit('components/tab-bar/test/scenarios?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-tab-bar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
