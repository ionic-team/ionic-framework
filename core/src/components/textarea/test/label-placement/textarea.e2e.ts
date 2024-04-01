import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'textarea: label placement start'
      ),
      () => {
        test('label should appear on the starting side of the textarea', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-textarea label="Standard" value="Lorem ipsum" label-placement="start"></ion-textarea>
      `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-start`
            )
          );
        });
        test('textarea should render multiple lines of text', async ({
          page,
        }) => {
          await page.setContent(
            `
      <ion-textarea label="Standard" label-placement="start" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
    `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-start-multi-line-value`
            )
          );
        });
      }
    );
    test.describe(
      title(
        'textarea: label placement end'
      ),
      () => {
        test('label should appear on the ending side of the textarea', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-textarea label="Standard" value="Lorem ipsum" label-placement="end"></ion-textarea>
      `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-end`
            )
          );
        });
        test('textarea should render multiple lines of text', async ({
          page,
        }) => {
          await page.setContent(
            `
      <ion-textarea label="Standard" label-placement="end" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
    `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-end-multi-line-value`
            )
          );
        });
      }
    );
    test.describe(
      title(
        'textarea: label placement fixed'
      ),
      () => {
        test('label should appear on the starting side of the textarea and have a fixed width', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-textarea label="Standard" value="Lorem ipsum" label-placement="fixed"></ion-textarea>
      `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-fixed`
            )
          );
        });
        test('textarea should render multiple lines of text', async ({
          page,
        }) => {
          await page.setContent(
            `
      <ion-textarea label="Standard" label-placement="fixed" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
    `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-fixed-multi-line-value`
            )
          );
        });
        test('label should be truncated', async ({
          page,
        }) => {
          await page.setContent(
            `
      <ion-textarea label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." label-placement="fixed"></ion-textarea>
    `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-fixed-label-truncated`
            )
          );
        });
      }
    );
    test.describe(
      title(
        'textarea: label placement stacked'
      ),
      () => {
        test('label should appear above the textarea when there is a value', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-textarea label="Standard" value="Lorem ipsum" label-placement="stacked"></ion-textarea>
      `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-stacked-value`
            )
          );
        });
        test('label should appear above the textarea when there is a no value', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-textarea label="Standard" label-placement="stacked"></ion-textarea>
      `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-stacked-no-value`
            )
          );
        });
        test('textarea should render multiple lines of text', async ({
          page,
        }) => {
          await page.setContent(
            `
      <ion-textarea label="Standard" label-placement="stacked" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
    `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-stacked-multi-line-value`
            )
          );
        });
        test('label should be truncated', async ({
          page,
        }) => {
          await page.setContent(
            `
      <ion-textarea label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." label-placement="stacked"></ion-textarea>
    `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-stacked-label-truncated`
            )
          );
        });
      }
    );
    test.describe(
      title(
        'textarea: label placement floating'
      ),
      () => {
        test('label should appear above the textarea when there is a value', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-textarea label="Standard" value="Lorem ipsum" label-placement="floating"></ion-textarea>
      `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-floating-value`
            )
          );
        });
        test('label should appear on top of the textarea and hide the textarea when there is a no value', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-textarea label="Standard" label-placement="floating" placeholder="Placeholder"></ion-textarea>
      `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-floating-no-value`
            )
          );
        });
        test('label should appear on top of the textarea when there is a placeholder and no value', async ({
          page,
        }) => {
          await page.setContent(
            `
         <ion-textarea label="Standard" label-placement="floating" placeholder="Placeholder"></ion-textarea>
       `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-floating-no-value-placeholder`
            )
          );
        });
        test('label should appear on top of the textarea when the textarea is focused', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-textarea label="Standard" label-placement="floating" placeholder="Placeholder"></ion-textarea>
      `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          const nativeTextarea =
            textarea.locator(
              'textarea'
            );

          await nativeTextarea.click();
          await page.waitForChanges();

          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-focused-placement-floating-no-value`
            )
          );
        });
        test('textarea should render multiple lines of text', async ({
          page,
        }) => {
          await page.setContent(
            `
      <ion-textarea label="Standard" label-placement="floating" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
    `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-floating-multi-line-value`
            )
          );
        });
        test('label should be truncated', async ({
          page,
        }) => {
          await page.setContent(
            `
      <ion-textarea label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." label-placement="floating"></ion-textarea>
    `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-placement-floating-label-truncated`
            )
          );
        });
      }
    );
  }
);

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('textarea: label overflow'),
      () => {
        test('label property should be truncated with an ellipsis', async ({
          page,
        }) => {
          await page.setContent(
            `
            <ion-textarea label="Label Label Label Label Label" placeholder="Text Input"></ion-textarea>
          `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-label-truncate`
            )
          );
        });
        test('label slot should be truncated with an ellipsis', async ({
          page,
        }) => {
          await page.setContent(
            `
            <ion-textarea placeholder="Text Input">
              <div slot="label">Label Label Label Label Label</div>
            </ion-textarea>
          `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );
          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-label-slot-truncate`
            )
          );
        });
      }
    );
  }
);

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('textarea: async label'),
      () => {
        test('textarea should re-render when label slot is added async', async ({
          page,
        }) => {
          await page.setContent(
            `
            <ion-textarea fill="solid" label-placement="stacked" placeholder="Text Input"></ion-textarea>
          `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );

          await textarea.evaluate(
            (
              el: HTMLIonInputElement
            ) => {
              const labelEl =
                document.createElement(
                  'div'
                );
              labelEl.slot = 'label';
              labelEl.innerHTML =
                'Comments <span class="required" style="color: red">*</span';

              el.appendChild(labelEl);
            }
          );

          await page.waitForChanges();

          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-async-label`
            )
          );
        });
      }
    );
    test.describe(
      title(
        'textarea: flex in grid rendering'
      ),
      () => {
        test('should correctly render new lines in stacked textarea', async ({
          page,
        }) => {
          /**
           * While this bug only impacts Safari, we run this
           * text on all browsers to make sure the Safari fix
           * does not negatively impact other browsers.
           */
          test.info().annotations.push({
            type: 'issue',
            description:
              'https://github.com/ionic-team/ionic-framework/issues/27345',
          });

          /**
           * Add padding to make it easier to see
           * if the text is incorrectly flowing outside
           * the container on Safari.
           */
          await page.setContent(
            `
        <div style="padding: 20px;" class="container">
          <ion-textarea fill="solid" label="Comments" label-placement="stacked"></ion-textarea>
        </div>
      `,
            config
          );

          const nativeTextarea =
            page.locator(
              'ion-textarea textarea'
            );

          await nativeTextarea.type(`Comment
        With
        Multiple
        Lines`);

          await expect(
            page.locator('.container')
          ).toHaveScreenshot(
            screenshot(
              `textarea-multi-line-sizing`
            )
          );
        });
      }
    );
    test.describe(
      title(
        'textarea: floating/stacked label layering'
      ),
      () => {
        test('label should not be covered by text field', async ({
          page,
        }, testInfo) => {
          testInfo.annotations.push({
            type: 'issue',
            description:
              'https://github.com/ionic-team/ionic-framework/issues/27812',
          });
          await page.setContent(
            `
        <style>
          .custom-textarea .native-wrapper {
            background: pink;
          }
        </style>
        <ion-textarea class="custom-textarea" label="My Label" label-placement="stacked"></ion-textarea>
      `,
            config
          );

          const textarea = page.locator(
            'ion-textarea'
          );

          await expect(
            textarea
          ).toHaveScreenshot(
            screenshot(
              `textarea-label-layering`
            )
          );
        });
      }
    );
  }
);
