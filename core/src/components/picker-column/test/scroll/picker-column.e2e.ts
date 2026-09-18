import { expect } from '@playwright/test';
import type { E2EPage, E2ELocator } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/** The idle period the column waits out before it commits the centered option. */
const SCROLL_END_DELAY = 250;

/** Long enough that a pending commit has either landed or is never coming. */
const COMMIT_WINDOW = SCROLL_END_DELAY + 350;

interface SaveRecord {
  value: string;
  highlighted: string;
}

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column: scroll'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column value="5">
            ${Array.from(
              { length: 200 },
              (_, i) => `<ion-picker-column-option value="${i}">${i}</ion-picker-column-option>`
            ).join('')}
          </ion-picker-column>
        </ion-picker>
        <button id="save">Save</button>
      `,
        config
      );

      await page.locator('ion-picker-column-option.option-active').waitFor();

      await page.evaluate(() => {
        const column = document.querySelector('ion-picker-column')!;
        const scrollEl = column.shadowRoot!.querySelector('.picker-opts')!;
        const w = window as any;

        w.lastScrollAt = 0;
        scrollEl.addEventListener('scroll', () => {
          w.lastScrollAt = performance.now();
        });

        /**
         * Records the value at the moment the click handler ran, alongside the
         * option the user could see under the highlight.
         */
        document.querySelector('#save')!.addEventListener('click', () => {
          w.onSave = {
            value: String(column.value),
            highlighted: String(column.querySelector<HTMLIonPickerColumnOptionElement>('.option-active')?.value ?? ''),
          };
        });
      });
    });

    const startScroll = (page: E2EPage) =>
      page.evaluate(() => {
        const scrollEl = document.querySelector('ion-picker-column')!.shadowRoot!.querySelector('.picker-opts')!;
        scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
      });

    /**
     * Presses the column the way a drag would, so the scroll that follows counts
     * as the user's. Pressing dead center lands on the option already selected,
     * so the press itself does not change the value.
     */
    const pressColumn = async (page: E2EPage) => {
      const box = (await page.locator('ion-picker-column').boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.up();
    };

    /**
     * The race needs the highlight off the committed value, so the column is
     * showing one option while reporting another.
     */
    const waitForMidScroll = (page: E2EPage) =>
      page.waitForFunction(
        () => {
          const highlighted = document.querySelector<HTMLIonPickerColumnOptionElement>(
            'ion-picker-column .option-active'
          );
          const column = document.querySelector('ion-picker-column')!;
          const isScrolling = performance.now() - (window as any).lastScrollAt < 100;
          return highlighted !== null && String(highlighted.value) !== String(column.value) && isScrolling;
        },
        undefined,
        { timeout: 5000 }
      );

    /** Presses an element with `pointerdown` before `click`, the order a tap uses. */
    const press = (page: E2EPage, selector: string) =>
      page.evaluate((selector) => {
        const target = document.querySelector(selector)!;
        target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
        target.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      }, selector);

    /**
     * Presses the given element in the same frame the column is first seen
     * mid-scroll. The polling and the press share one evaluate so no round trip
     * can let the scroll finish first, which would leave nothing to race.
     *
     * Passing `past` waits for the highlight to get beyond a given option, for
     * when the column already reports the option it is traveling towards.
     */
    const pressWhenMidScroll = (page: E2EPage, selector: string, past?: number) =>
      page.evaluate(
        ({ selector, past }) =>
          new Promise<void>((resolve, reject) => {
            const column = document.querySelector('ion-picker-column')!;
            const deadline = performance.now() + 5000;

            const isMidScroll = () => {
              const highlighted = column.querySelector<HTMLIonPickerColumnOptionElement>('.option-active');

              if (highlighted === null || performance.now() - (window as any).lastScrollAt >= 100) {
                return false;
              }

              return past === undefined
                ? String(highlighted.value) !== String(column.value)
                : Number(highlighted.value) > past;
            };

            const poll = () => {
              if (isMidScroll()) {
                const target = document.querySelector(selector)!;
                target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
                target.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
                resolve();
              } else if (performance.now() > deadline) {
                reject(new Error('the column never reached the expected mid-scroll state'));
              } else {
                requestAnimationFrame(poll);
              }
            };

            requestAnimationFrame(poll);
          }),
        { selector, past }
      );

    const highlightedValue = (page: E2EPage) =>
      page.evaluate(() => {
        const highlighted = document.querySelector<HTMLIonPickerColumnOptionElement>(
          'ion-picker-column .option-active'
        );
        return highlighted === null ? null : Number(highlighted.value);
      });

    /**
     * Presses Save once the column has visibly moved off the option it is
     * reporting but is still scrolling towards its resting place.
     */
    const pressSaveMidScroll = async (page: E2EPage): Promise<SaveRecord> => {
      await pressColumn(page);
      await startScroll(page);
      await pressWhenMidScroll(page, '#save');

      return await page.evaluate(() => (window as any).onSave);
    };

    /**
     * Stands in for an overscroll bounce leaving the empty padding rows under
     * the highlight. Scrolling onto the padding cannot produce this reliably,
     * because snapping pulls the column straight back.
     */
    const hideOptionsFromHitTesting = (page: E2EPage) =>
      page.evaluate(() => {
        document.querySelectorAll<HTMLElement>('ion-picker-column-option').forEach((option) => {
          option.style.pointerEvents = 'none';
        });
      });

    const dispatchScroll = (page: E2EPage) =>
      page.evaluate(() => {
        const scrollEl = document.querySelector('ion-picker-column')!.shadowRoot!.querySelector('.picker-opts')!;
        scrollEl.dispatchEvent(new Event('scroll'));
      });

    const waitForColumnIdle = (page: E2EPage) =>
      page.waitForFunction((delay) => performance.now() - (window as any).lastScrollAt > delay, COMMIT_WINDOW, {
        timeout: 10000,
      });

    /** Drains the rAF the column schedules to react to a scroll. */
    const flushAnimationFrames = (page: E2EPage) =>
      page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
      );

    test('should commit the visible option before an outside click handler runs', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30449',
      });

      const onSave = await pressSaveMidScroll(page);

      expect(onSave.highlighted).not.toBe('5');

      // The value the Save button saw is the option the user could see.
      expect(onSave.value).toBe(onSave.highlighted);
    });

    /**
     * Tapping an option part way through a flick replaces the selection, so an
     * outside press during the scroll to it must not commit an option on the way.
     */
    test('should keep a selection made mid-flick when Save is pressed', async ({ page }) => {
      await pressColumn(page);
      await startScroll(page);
      await waitForMidScroll(page);

      // Stands in for tapping an option while the wheel is still coasting.
      await page.locator('ion-picker-column').evaluate((column: HTMLIonPickerColumnElement) => column.setValue('150'));
      await pressWhenMidScroll(page, '#save');

      const onSave: SaveRecord = await page.evaluate(() => (window as any).onSave);

      expect(onSave.value).toBe('150');

      await expect(page.locator('ion-picker-column')).toHaveJSProperty('value', '150');
    });

    /**
     * Taking hold of the wheel mid-scroll does not start a new scroll, so the
     * column has to notice the user part way through one it is already running.
     */
    test('should commit the visible option when the user takes over a scroll in progress', async ({ page }) => {
      await page.locator('ion-picker-column').evaluate((column: HTMLIonPickerColumnElement) => {
        column.value = '150';
      });

      // Wait until the column is genuinely in transit, past 5 but not yet at 150.
      await page.waitForFunction(
        () => {
          const highlighted = document.querySelector<HTMLIonPickerColumnOptionElement>(
            'ion-picker-column .option-active'
          );
          const value = highlighted === null ? null : Number(highlighted.value);
          return value !== null && value > 5 && value < 150;
        },
        undefined,
        { timeout: 5000 }
      );

      // Stands in for grabbing the wheel while it is still traveling.
      await page.evaluate(() => {
        const scrollEl = document.querySelector('ion-picker-column')!.shadowRoot!.querySelector('.picker-opts')!;
        scrollEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
        scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
      });

      // Press once the user's own scroll has carried it past where it was headed.
      await pressWhenMidScroll(page, '#save', 150);

      const onSave: SaveRecord = await page.evaluate(() => (window as any).onSave);

      expect(onSave.value).toBe(onSave.highlighted);
    });

    test('should not move on past the option it committed to an outside click', async ({ page }) => {
      const onSave = await pressSaveMidScroll(page);

      /**
       * Waits for the column to stop rather than a fixed window. If the press had
       * not halted the momentum, the scroll would run on for about a second and
       * commit a later option.
       */
      await waitForColumnIdle(page);

      await expect(page.locator('ion-picker-column')).toHaveJSProperty('value', onSave.value);
    });

    /**
     * The halt is the column scrolling itself, so the scroll events it produces
     * must not be read as the wheel still moving and start a second commit.
     */
    test('should emit one change for a scroll ended by an outside click', async ({ page }) => {
      const ionChange = await page.spyOnEvent('ionChange');

      const onSave = await pressSaveMidScroll(page);

      await waitForColumnIdle(page);

      expect(ionChange).toHaveReceivedEventTimes(1);
      expect(ionChange).toHaveReceivedEventDetail({ value: onSave.value });
    });

    /**
     * A frame with no option centered must leave the highlight where it is.
     */
    test('should keep the highlight when a scroll frame has no option centered', async ({ page }) => {
      await hideOptionsFromHitTesting(page);
      await dispatchScroll(page);
      await page.waitForTimeout(COMMIT_WINDOW);

      await expect(page.locator('ion-picker-column-option.option-active')).toHaveCount(1);
      await expect(page.locator('ion-picker-column-option.option-active')).toHaveJSProperty('value', '5');
    });

    /**
     * The same uncentered frame arriving part way through a scroll must keep the
     * option that was already centered, and must still commit it.
     */
    test('should commit the last centered option when a later frame has none', async ({ page }) => {
      await pressColumn(page);
      await startScroll(page);
      await waitForMidScroll(page);

      /**
       * From here no frame can center an option, so whatever was centered last is
       * what the column falls back on. Read it after the scroll rAF has drained
       * so an already queued frame cannot move it afterwards.
       */
      await hideOptionsFromHitTesting(page);
      await flushAnimationFrames(page);

      const centered = await page
        .locator('ion-picker-column-option.option-active')
        .evaluate((option: HTMLIonPickerColumnOptionElement) => String(option.value));
      expect(centered).not.toBe('5');

      await dispatchScroll(page);

      /**
       * The scroll is still coasting, and every frame it produces now finds no
       * option, so the commit lands once it stops.
       */
      await expect(page.locator('ion-picker-column')).toHaveJSProperty('value', centered);

      await expect(page.locator('ion-picker-column-option.option-active')).toHaveCount(1);
      await expect(page.locator('ion-picker-column-option.option-active')).toHaveJSProperty('value', centered);
    });

    /**
     * Once a commit has landed, a later scroll that never centers an option must
     * not fall back on it.
     */
    test('should not commit an option left over from a finished scroll', async ({ page }) => {
      await pressColumn(page);
      await startScroll(page);
      await waitForColumnIdle(page);

      // The scroll ran to the end of the column, so this is where it settled.
      const committed = await highlightedValue(page);
      expect(committed).toBe(199);

      // From here the column can never find an option under the highlight again.
      await hideOptionsFromHitTesting(page);

      await pressColumn(page);
      await page.evaluate(() => {
        const scrollEl = document.querySelector('ion-picker-column')!.shadowRoot!.querySelector('.picker-opts')!;
        scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
      });
      await press(page, '#save');

      /**
       * Falling back on the leftover option would have halted this scroll and
       * dragged the column back to the far end, so it would never arrive.
       */
      await page.waitForFunction(
        () => document.querySelector('ion-picker-column')!.shadowRoot!.querySelector('.picker-opts')!.scrollTop < 50,
        undefined,
        { timeout: 5000 }
      );

      await expect(page.locator('ion-picker-column')).toHaveJSProperty('value', String(committed));
    });

    /**
     * A keyed list reorder moves a column rather than replacing it, which
     * disconnects and reconnects it without the visibility observer reporting a
     * change. The column has to keep reacting to scrolls afterwards.
     */
    test('should still track scrolling after the column is moved', async ({ page }) => {
      await page.evaluate(() => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        host.appendChild(document.querySelector('ion-picker')!);
      });

      await startScroll(page);

      // The last option, since the scroll runs to the end of the column.
      await expect(page.locator('ion-picker-column-option.option-active')).toHaveJSProperty('value', '199');
      await expect(page.locator('ion-picker-column')).toHaveJSProperty('value', '199');
    });

    /**
     * The frame in which the column reacts to a scroll cannot be cancelled, so
     * it can land after the column has already been torn down.
     */
    test('should not commit a value after the column is removed mid-scroll', async ({ page }) => {
      /**
       * Spied on the column rather than the page because the picker is removed
       * before the commit would fire, and an event on a detached element never
       * reaches the page.
       */
      const ionChange = await (page.locator('ion-picker-column') as E2ELocator).spyOnEvent('ionChange');

      await page.evaluate(() => {
        const column = document.querySelector('ion-picker-column')!;
        const scrollEl = column.shadowRoot!.querySelector('.picker-opts')!;

        /**
         * The column registered its own scroll listener first, so by the time
         * this one runs the column has already queued the frame that reacts to
         * this scroll. Removing the picker here leaves that frame pending. Wait
         * a few scrolls first so the column has centered an option to commit.
         */
        let scrolls = 0;
        scrollEl.addEventListener('scroll', () => {
          if (++scrolls === 5) {
            document.querySelector('ion-picker')!.remove();
          }
        });

        scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
      });

      await page.waitForTimeout(COMMIT_WINDOW);

      expect(ionChange).not.toHaveReceivedEvent();
    });

    /**
     * A scroll the column starts itself is not a selection the user made, so an
     * outside press during one must not freeze it.
     */
    test('should not commit an option that a programmatic scroll is passing through', async ({ page }) => {
      const ionChange = await page.spyOnEvent('ionChange');

      await page.locator('ion-picker-column').evaluate((column: HTMLIonPickerColumnElement) => {
        column.value = '150';
      });

      await pressWhenMidScroll(page, '#save');

      await page.waitForTimeout(COMMIT_WINDOW);

      // Setting the `value` property must not emit `ionChange`.
      expect(ionChange).not.toHaveReceivedEvent();

      // The column must still be headed for the option the application asked for.
      await expect(page.locator('ion-picker-column')).toHaveJSProperty('value', '150');
    });

    /**
     * Selecting an option directly scrolls the column to it. That scroll belongs
     * to the selection the user already made, so an outside press during it must
     * not redirect the value.
     */
    test('should not commit an option that a selected scroll is passing through', async ({ page }) => {
      const ionChange = await page.spyOnEvent('ionChange');

      // A press that selects the option already under the highlight, so nothing scrolls yet.
      await pressColumn(page);

      // Stands in for tapping an option far down the column.
      await page.locator('ion-picker-column').evaluate((column: HTMLIonPickerColumnElement) => column.setValue('150'));

      await pressWhenMidScroll(page, '#save');

      await page.waitForTimeout(COMMIT_WINDOW);

      // Only the selection itself is committed, not an option on the way to it.
      expect(ionChange).toHaveReceivedEventTimes(1);
      expect(ionChange).toHaveReceivedEventDetail({ value: '150' });
      await expect(page.locator('ion-picker-column')).toHaveJSProperty('value', '150');
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column: sibling columns'), () => {
    /**
     * A press inside the picker does not read a coasting column's value, so it
     * must not stop it on an option the user was only scrolling past.
     */
    test('should keep coasting when another column in the picker is pressed', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column class="first" value="5">
            ${Array.from(
              { length: 200 },
              (_, i) => `<ion-picker-column-option value="${i}">${i}</ion-picker-column-option>`
            ).join('')}
          </ion-picker-column>
          <ion-picker-column class="second" value="a">
            <ion-picker-column-option value="a">a</ion-picker-column-option>
            <ion-picker-column-option value="b">b</ion-picker-column-option>
          </ion-picker-column>
        </ion-picker>
      `,
        config
      );

      await page.locator('.first ion-picker-column-option.option-active').waitFor();

      await page.evaluate(() => {
        const scrollEl = document.querySelector('.first')!.shadowRoot!.querySelector('.picker-opts')!;
        (window as any).lastScrollAt = 0;
        scrollEl.addEventListener('scroll', () => {
          (window as any).lastScrollAt = performance.now();
        });
      });

      const first = page.locator('.first');
      const box = (await first.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.up();

      // Press the sibling in the same frame the first column is seen mid-flick.
      await page.evaluate(() => {
        const scrollEl = document.querySelector('.first')!.shadowRoot!.querySelector('.picker-opts')!;
        scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });

        return new Promise<void>((resolve, reject) => {
          const column = document.querySelector<HTMLIonPickerColumnElement>('.first')!;
          const deadline = performance.now() + 5000;

          const poll = () => {
            const highlighted = column.querySelector<HTMLIonPickerColumnOptionElement>('.option-active');
            const isScrolling = performance.now() - (window as any).lastScrollAt < 100;

            if (highlighted !== null && String(highlighted.value) !== String(column.value) && isScrolling) {
              const sibling = document.querySelector('.second')!;
              sibling.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
              resolve();
            } else if (performance.now() > deadline) {
              reject(new Error('the first column never reached the expected mid-scroll state'));
            } else {
              requestAnimationFrame(poll);
            }
          };

          requestAnimationFrame(poll);
        });
      });

      // The scroll was headed for the end of the column, so that is where it belongs.
      await expect(first).toHaveJSProperty('value', '199');
      await expect(page.locator('.first ion-picker-column-option.option-active')).toHaveJSProperty('value', '199');
    });
  });
});
