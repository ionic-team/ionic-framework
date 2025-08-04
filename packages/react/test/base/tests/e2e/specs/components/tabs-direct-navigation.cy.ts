describe('Tabs Direct Navigation', () => {
  it('should select the correct tab when navigating directly to home route', () => {
    cy.visit('/tabs-direct-navigation/home');
    cy.get('[data-testid="home-tab"]').should('have.class', 'tab-selected');
    cy.get('[data-testid="home-content"]').should('be.visible');
  });

  it('should select the correct tab when navigating directly to radio route', () => {
    cy.visit('/tabs-direct-navigation/radio');
    cy.get('[data-testid="radio-tab"]').should('have.class', 'tab-selected');
    cy.get('[data-testid="radio-content"]').should('be.visible');
  });

  it('should select the correct tab when navigating directly to library route', () => {
    cy.visit('/tabs-direct-navigation/library');
    cy.get('[data-testid="library-tab"]').should('have.class', 'tab-selected');
    cy.get('[data-testid="library-content"]').should('be.visible');
  });

  it('should select the correct tab when navigating directly to search route', () => {
    cy.visit('/tabs-direct-navigation/search');
    cy.get('[data-testid="search-tab"]').should('have.class', 'tab-selected');
    cy.get('[data-testid="search-content"]').should('be.visible');
  });

  it('should update tab selection when navigating between tabs', () => {
    cy.visit('/tabs-direct-navigation/home');
    cy.get('[data-testid="home-tab"]').should('have.class', 'tab-selected');
    
    cy.get('[data-testid="radio-tab"]').click();
    cy.get('[data-testid="radio-tab"]').should('have.class', 'tab-selected');
    cy.get('[data-testid="home-tab"]').should('not.have.class', 'tab-selected');
    cy.get('[data-testid="radio-content"]').should('be.visible');
  });
});