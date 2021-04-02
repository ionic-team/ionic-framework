describe('icon: dir', () => {
  beforeEach(() => {
    cy.visit('components/icon/test/dir?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-icon').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('icon: dir, rtl', () => {
  beforeEach(() => {
    cy.visit('components/icon/test/dir?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-icon').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
