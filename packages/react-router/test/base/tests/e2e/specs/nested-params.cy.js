const port = 3000;

describe('Nested Params', () => {
  /*
    Tests that route params are correctly passed to nested routes
    when using parameterized wildcard routes (e.g., user/:userId/*).
  */

  it('/nested-params > Landing page should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');
  });

  it('/nested-params > Navigate to user details > Params should be available', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');

    cy.get('#go-to-user-42').click();

    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');
  });

  it('/nested-params > Navigate between sibling routes > Params should be maintained', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 42 details
    cy.get('#go-to-user-42').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');

    // Navigate to settings (sibling route)
    cy.get('#go-to-settings').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-settings-param"]').should('contain', 'Settings view user: 42');

    // Navigate back to details
    cy.contains('ion-button', 'Back to Details').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');
  });

  it('/nested-params > Direct navigation to nested route > Params should be available', () => {
    // Navigate directly to a nested route with params
    cy.visit(`http://localhost:${port}/nested-params/user/123/settings`);

    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 123');
    cy.get('[data-testid="user-settings-param"]').should('contain', 'Settings view user: 123');
  });

  it('/nested-params > Deep link to child then navigate to landing > Landing should show correctly', () => {
    // Deep-link directly to a nested child route
    cy.visit(`http://localhost:${port}/nested-params/user/42/details`);
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');

    // Navigate back to the landing (index route)
    cy.get('#back-to-landing').click();
    cy.ionPageVisible('nested-params-landing');

    // The user layout page should be hidden (Ionic preserves it in DOM for back navigation)
    cy.get('[data-pageid^="nested-params-user-"]').should('have.class', 'ion-page-hidden');
  });

  it('/nested-params > Deep link then navigate to landing and back > Round-trip should work', () => {
    // Deep-link directly to a nested child route
    cy.visit(`http://localhost:${port}/nested-params/user/42/details`);
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');

    // Navigate to the landing page
    cy.get('#back-to-landing').click();
    cy.ionPageVisible('nested-params-landing');

    // Navigate back to user details
    cy.get('#go-to-user-42').click();
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
  });

  it('/nested-params > Navigate to user then back > No visual overlap during transition', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 99
    cy.get('#go-to-user-99').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 99');

    // Install an overlap detector that runs every animation frame.
    // It checks whether the landing page and user page IonPage elements are
    // simultaneously visible — which is the root cause of the overlap bug.
    // We check the IonPage elements directly (not descendants) because CSS
    // display is not inherited — a child's computed display can be 'block'
    // even when a parent has display:none.
    cy.window().then((win) => {
      win.__overlapDetected = false;
      const check = () => {
        const landing = win.document.querySelector('[data-pageid="nested-params-landing"]');
        const userPage = win.document.querySelector('[data-pageid^="nested-params-user-"]');
        if (landing && userPage) {
          const landingStyle = win.getComputedStyle(landing);
          const userStyle = win.getComputedStyle(userPage);
          const landingVisible = landingStyle.display !== 'none' && landingStyle.visibility !== 'hidden' && landingStyle.opacity !== '0';
          const userVisible = userStyle.display !== 'none' && userStyle.visibility !== 'hidden' && userStyle.opacity !== '0';
          if (landingVisible && userVisible) {
            win.__overlapDetected = true;
          }
        }
        if (!win.__overlapCheckDone) {
          requestAnimationFrame(check);
        }
      };
      requestAnimationFrame(check);
    });

    // Go back to landing
    cy.go('back');
    cy.ionPageVisible('nested-params-landing');
    cy.get('[data-testid="user-layout-param"]').should('not.exist');

    // Stop the observer and verify no overlap was detected
    cy.window().then((win) => {
      win.__overlapCheckDone = true;
      expect(win.__overlapDetected).to.be.false;
    });
  });

  it('/nested-params > Navigate to user, back, forward, back > Pages should not persist', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 99
    cy.get('#go-to-user-99').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 99');

    // Go back
    cy.go('back');
    cy.ionPageVisible('nested-params-landing');

    // Go forward — wait for async POP event processing and transition to settle
    cy.go('forward');
    cy.wait(500);
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 99');

    // Go back again
    cy.go('back');
    cy.ionPageVisible('nested-params-landing');
    cy.get('[data-testid="user-layout-param"]').should('not.exist');
  });

  it('/nested-params > Different users should have different params', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 42
    cy.get('#go-to-user-42').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');

    // Go back to landing
    cy.go('back');
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 99
    cy.get('#go-to-user-99').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 99');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 99');
  });

  it('/nested-params > Full back navigation from sibling routes to root > Root page should show', () => {
    // Start at root
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Navigate to nested-params
    cy.contains('ion-item', 'Nested Params').click();
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 99 details
    cy.get('#go-to-user-99').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 99');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 99');

    // Go to settings
    cy.get('#go-to-settings').click();
    cy.get('[data-testid="user-settings-param"]').should('contain', 'Settings view user: 99');

    // Hit "Back to Details" (this is a forward push via routerLink)
    cy.contains('ion-button', 'Back to Details').click();
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 99');

    // Browser back repeatedly to root
    // Back 1: details -> settings
    cy.go('back');
    cy.get('[data-testid="user-settings-param"]').should('contain', 'Settings view user: 99');

    // Back 2: settings -> details
    cy.go('back');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 99');

    // Back 3: details -> nested-params landing
    cy.go('back');
    cy.ionPageVisible('nested-params-landing');

    // Back 4: nested-params -> root
    cy.go('back');
    cy.ionPageVisible('home');
    cy.get('[data-testid="user-layout-param"]').should('not.exist');
  });

  it('/nested-params > Sibling route transitions (details <-> settings) > No visual overlap', () => {
    // Start directly on the details page
    cy.visit(`http://localhost:${port}/nested-params/user/99/details`);
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 99');

    // Install overlap detector that checks whether details and settings IonPage
    // elements are simultaneously visible inside the nested outlet.
    cy.window().then((win) => {
      win.__siblingOverlapDetected = false;
      const check = () => {
        const details = win.document.querySelector('[data-pageid="nested-params-details"]');
        const settings = win.document.querySelector('[data-pageid="nested-params-settings"]');
        if (details && settings) {
          const detailsStyle = win.getComputedStyle(details);
          const settingsStyle = win.getComputedStyle(settings);
          const detailsVisible = detailsStyle.display !== 'none' && detailsStyle.visibility !== 'hidden' && detailsStyle.opacity !== '0';
          const settingsVisible = settingsStyle.display !== 'none' && settingsStyle.visibility !== 'hidden' && settingsStyle.opacity !== '0';
          if (detailsVisible && settingsVisible) {
            win.__siblingOverlapDetected = true;
          }
        }
        if (!win.__siblingOverlapCheckDone) {
          requestAnimationFrame(check);
        }
      };
      requestAnimationFrame(check);
    });

    // Navigate details -> settings
    cy.get('#go-to-settings').click();
    cy.get('[data-testid="user-settings-param"]').should('contain', 'Settings view user: 99');

    // Navigate settings -> details
    cy.contains('ion-button', 'Back to Details').click();
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 99');

    // Stop the observer and verify no overlap was detected in either direction
    cy.window().then((win) => {
      win.__siblingOverlapCheckDone = true;
      expect(win.__siblingOverlapDetected).to.be.false;
    });
  });

  /**
   * Deep nesting tests (4 levels) to validate derivePathnameToMatch
   * handles relative paths correctly at depth > 2 parent segments.
   *
   * Route structure:
   *   /nested-params/* (App level)
   *     user/:userId/* (NestedParamsRoot outlet)
   *       details (UserLayout outlet)
   *       settings (UserLayout outlet)
   *       profile/* (UserLayout outlet)
   *         edit (ProfileLayout outlet - 4th level)
   *         view (ProfileLayout outlet - 4th level)
   */

  it('/nested-params > Deep nesting > Navigate to profile edit (4 levels deep)', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 42 details
    cy.get('#go-to-user-42').click();
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');

    // Navigate to profile edit (4th level)
    cy.get('#go-to-profile-edit').click();
    cy.get('[data-testid="profile-layout-param"]').should('contain', 'Profile layout user: 42');
    cy.get('[data-testid="profile-edit-param"]').should('contain', 'Profile edit user: 42');
    cy.location('pathname').should('eq', '/nested-params/user/42/profile/edit');
  });

  it('/nested-params > Deep nesting > Direct navigation to 4th level route', () => {
    // Navigate directly to a deeply nested route
    cy.visit(`http://localhost:${port}/nested-params/user/42/profile/edit`);

    cy.get('[data-testid="profile-layout-param"]').should('contain', 'Profile layout user: 42');
    cy.get('[data-testid="profile-edit-param"]').should('contain', 'Profile edit user: 42');
  });

  it('/nested-params > Deep nesting > Navigate between 4th level siblings (edit <-> view)', () => {
    cy.visit(`http://localhost:${port}/nested-params/user/42/profile/edit`);
    cy.get('[data-testid="profile-edit-param"]').should('contain', 'Profile edit user: 42');

    // Navigate to profile view (sibling at 4th level)
    cy.get('#go-to-profile-view').click();
    cy.get('[data-testid="profile-view-param"]').should('contain', 'Profile view user: 42');
    cy.location('pathname').should('eq', '/nested-params/user/42/profile/view');

    // Navigate back to profile edit
    cy.get('#back-to-profile-edit').click();
    cy.get('[data-testid="profile-edit-param"]').should('contain', 'Profile edit user: 42');
    cy.location('pathname').should('eq', '/nested-params/user/42/profile/edit');
  });

  it('/nested-params > Deep nesting > Back navigation from 4th level to root', () => {
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Navigate to nested-params
    cy.contains('ion-item', 'Nested Params').click();
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 42 details
    cy.get('#go-to-user-42').click();
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');

    // Navigate to profile edit (4th level)
    cy.get('#go-to-profile-edit').click();
    cy.get('[data-testid="profile-edit-param"]').should('contain', 'Profile edit user: 42');

    // Navigate to profile view (sibling at 4th level)
    cy.get('#go-to-profile-view').click();
    cy.get('[data-testid="profile-view-param"]').should('contain', 'Profile view user: 42');

    // Browser back: view -> edit
    cy.go('back');
    cy.get('[data-testid="profile-edit-param"]').should('contain', 'Profile edit user: 42');

    // Browser back: edit -> details
    cy.go('back');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');

    // Browser back: details -> landing
    cy.go('back');
    cy.ionPageVisible('nested-params-landing');

    // Browser back: landing -> home
    cy.go('back');
    cy.ionPageVisible('home');
  });

  it('/nested-params > Sibling route transitions > No nested scrollbars during transition', () => {
    // Start directly on the details page
    cy.visit(`http://localhost:${port}/nested-params/user/99/details`);
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 99');

    // Install a detector that checks for multiple visible ion-content elements
    // inside the nested outlet. Multiple visible ion-content elements cause
    // nested scrollbars during transitions.
    cy.window().then((win) => {
      win.__nestedScrollbarsDetected = false;
      const check = () => {
        const outlet = win.document.querySelector('#nested-params-user-outlet');
        if (outlet) {
          const contents = outlet.querySelectorAll('ion-content');
          let visibleCount = 0;
          contents.forEach((content) => {
            // Check the parent IonPage element's visibility
            const page = content.closest('.ion-page');
            if (page) {
              const style = win.getComputedStyle(page);
              if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                visibleCount++;
              }
            }
          });
          if (visibleCount > 1) {
            win.__nestedScrollbarsDetected = true;
          }
        }
        if (!win.__nestedScrollbarsCheckDone) {
          requestAnimationFrame(check);
        }
      };
      requestAnimationFrame(check);
    });

    // Navigate details -> settings
    cy.get('#go-to-settings').click();
    cy.get('[data-testid="user-settings-param"]').should('contain', 'Settings view user: 99');

    // Navigate settings -> details
    cy.contains('ion-button', 'Back to Details').click();
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 99');

    // Stop the observer and verify no nested scrollbars were detected
    cy.window().then((win) => {
      win.__nestedScrollbarsCheckDone = true;
      expect(win.__nestedScrollbarsDetected).to.be.false;
    });
  });
});
