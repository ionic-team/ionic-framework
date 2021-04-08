describe('split-pane: basic', () => {
  const MIN_WIDTH = '#side-min-width';
  const MAX_WIDTH = '#side-max-width';
  const WIDTH = '#side-width';

  beforeEach(() => {
    cy.visit('components/split-pane/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-split-pane').should('have.class', 'hydrated');

    // cy.screenshot();
  })

  it('should set the side to the min width', () => {
    cy.get(MIN_WIDTH).click();

    // cy.screenshot();
  })

  it('should set the side to the max width', () => {
    cy.get(MAX_WIDTH).click();

    // cy.screenshot();
  })

  it('should set the side to a fixed width', () => {
    cy.get(WIDTH).click();

    // cy.screenshot();
  })
});
