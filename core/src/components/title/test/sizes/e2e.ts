describe('title: sizes', () => {
  beforeEach(() => {
    cy.visit('components/title/test/sizes?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-title').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('title: sizes, rtl', () => {
  beforeEach(() => {
    cy.visit('components/title/test/sizes?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-title').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
