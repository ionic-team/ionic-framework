import { generateTestName } from '../../../../utils/test/utils';

const dirs = [false, true];

dirs.forEach(rtl => {
  const testName = generateTestName('fab', 'basic', rtl);

  describe(testName, () => {
    beforeEach(() => {
      cy.goToUrl('fab', 'basic', rtl);
    })

    it('should render', () => {
      cy.get('ion-fab').should('have.class', 'hydrated');

      // cy.screenshot();
    });

    it('should activate then deactivate the fab', () => {
      cy.get('#fab1').click();

      ensureFabState('#fab1', 'active');

      // cy.screenshot();

      cy.get('#fab1').click();

      ensureFabState('#fab1', 'inactive');

      // cy.screenshot();
    });

    it('should not activate the disabled fab', () => {
      cy.get('#fab2').click();

      ensureFabState('#fab2', 'inactive');

      // cy.screenshot();
    });
  });
});

const ensureFabState = async (selector: string, state: string) => {
  const fab = cy.get(selector);
  const active = (state === 'active') ? true : false;

  const fabList = fab.find('ion-fab-list');
  if (active) {
    fabList.should('have.class', 'fab-list-active');
  }
};
