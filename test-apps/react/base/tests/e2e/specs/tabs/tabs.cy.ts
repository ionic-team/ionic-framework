describe('IonTabs', () => {
  beforeEach(() => {
    cy.visit('/tabs/tab1');
  });

  it('should handle onClick handlers on IonTabButton', () => {
    const stub = cy.stub();

    cy.on('window:alert', stub);
    cy.get('ion-tab-button[tab="tab1"]').click().then(() => {
      expect(stub.getCall(0)).to.be.calledWith('Tab was clicked')
    });

  });
});
