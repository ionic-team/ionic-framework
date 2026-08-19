import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

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
        const col = document.querySelector('ion-picker-column') as any;
        const scrollEl = col.shadowRoot.querySelector('.picker-opts');
        const w = window as any;

        w.lastScrollAt = 0;
        scrollEl.addEventListener('scroll', () => {
          w.lastScrollAt = performance.now();
        });

        /**
         * Records the value at the moment the click handler ran, alongside the
         * option the user could actually see under the highlight.
         */
        document.querySelector('#save')!.addEventListener('click', () => {
          w.onSave = {
            value: col.value,
            highlighted: col.querySelector('.option-active')?.value ?? null,
            msSinceScroll: performance.now() - w.lastScrollAt,
          };
        });

        w.startScroll = () => scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
      });
    });

    /**
     * Presses the column the way a drag would, so the scroll that follows counts
     * as the user's. Pressing dead centre lands on the option already selected,
     * so the press itself does not change the value.
     */
    const pressColumn = async (page: E2EPage) => {
      const box = (await page.locator('ion-picker-column').boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.up();
    };

    /**
     * Clicks the Save button once the column has visibly moved off its starting
     * option but is still scrolling towards its resting place.
     */
    const clickSaveMidScroll = async (page: E2EPage) => {
      await pressColumn(page);
      await page.evaluate(() => (window as any).startScroll());

      await page.waitForFunction(
        () => {
          const col = document.querySelector('ion-picker-column') as any;
          const highlighted = col.querySelector('.option-active');
          const isScrolling = performance.now() - (window as any).lastScrollAt < 100;
          return highlighted !== null && highlighted.value !== '5' && isScrolling;
        },
        undefined,
        { timeout: 5000 }
      );

      await page.locator('#save').click();

      return await page.evaluate(() => (window as any).onSave);
    };

    test('should commit the visible option before an outside click handler runs', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30449',
      });

      const onSave = await clickSaveMidScroll(page);

      /**
       * Guards against a false pass: if the column had already stopped
       * scrolling then this test is not exercising the race at all.
       */
      expect(onSave.msSinceScroll).toBeLessThan(100);

      expect(onSave.highlighted).not.toBe('5');

      // The value the Save button saw is the option the user could see.
      expect(onSave.value).toBe(onSave.highlighted);
    });

    test('should not move on past the option it committed to an outside click', async ({ page }) => {
      const onSave = await clickSaveMidScroll(page);

      // Give any residual momentum and the pending commit time to resolve.
      await page.waitForTimeout(600);

      await expect(page.locator('ion-picker-column')).toHaveJSProperty('value', onSave.value);
    });

    /**
     * An overscroll bounce can briefly leave the column's empty padding rows
     * under the highlight instead of an option. That frame must not throw away
     * the current selection or the pending commit.
     */
    test('should keep its selection when a scroll frame has no option centered', async ({ page }) => {
      await page.evaluate(() => {
        const col = document.querySelector('ion-picker-column') as any;
        const scrollEl = col.shadowRoot.querySelector('.picker-opts');

        /**
         * Snapping would otherwise pull the column straight back onto an
         * option, which is what hides this in a normal scroll.
         */
        scrollEl.style.scrollSnapType = 'none';
        scrollEl.scrollTop = 0;
        scrollEl.dispatchEvent(new Event('scroll'));
      });

      // Long enough that any pending commit has resolved.
      await page.waitForTimeout(400);

      await expect(page.locator('ion-picker-column-option.option-active')).toHaveCount(1);

      const { value, highlighted } = await page.evaluate(() => {
        const col = document.querySelector('ion-picker-column') as any;
        return { value: col.value, highlighted: col.querySelector('.option-active')?.value ?? null };
      });

      expect(value).toBe(highlighted);
    });

    /**
     * The same uncentered frame arriving part way through a scroll must keep the
     * option that was already centered, and must still commit it.
     */
    test('should commit the last centered option when a later frame has none', async ({ page }) => {
      await page.evaluate(() => {
        const col = document.querySelector('ion-picker-column') as any;
        const scrollEl = col.shadowRoot.querySelector('.picker-opts');
        const option = col.querySelectorAll('ion-picker-column-option')[10];

        /**
         * Snapping would otherwise pull the column back onto an option, which is
         * what hides this in a normal scroll.
         */
        scrollEl.style.scrollSnapType = 'none';

        option.scrollIntoView({ block: 'center' });
        scrollEl.dispatchEvent(new Event('scroll'));
      });

      // Let the column register option 10 as centered.
      await expect(page.locator('ion-picker-column-option.option-active')).toHaveJSProperty('value', '10');

      await page.evaluate(() => {
        const col = document.querySelector('ion-picker-column') as any;
        const scrollEl = col.shadowRoot.querySelector('.picker-opts');

        // Now put the empty padding rows under the highlight.
        scrollEl.scrollTop = 0;
        scrollEl.dispatchEvent(new Event('scroll'));
      });

      // Long enough that any pending commit has resolved.
      await page.waitForTimeout(400);

      await expect(page.locator('ion-picker-column-option.option-active')).toHaveCount(1);
      await expect(page.locator('ion-picker-column')).toHaveJSProperty('value', '10');
    });

    /**
     * The frame in which the column reacts to a scroll cannot be cancelled, so
     * it can land after the column has already been torn down.
     */
    test('should not commit a value after the column is removed mid-scroll', async ({ page }) => {
      const changes = await page.evaluate(async () => {
        const col = document.querySelector('ion-picker-column') as any;
        const picker = document.querySelector('ion-picker')!;
        const scrollEl = col.shadowRoot.querySelector('.picker-opts');
        const recorded: unknown[] = [];

        col.addEventListener('ionChange', (ev: any) => recorded.push(ev.detail.value));

        /**
         * The column registered its own scroll listener first, so by the time
         * this one runs the column has already queued the frame that reacts to
         * this scroll. Removing the column here leaves that frame pending. Wait
         * a few scrolls first so the column has centered an option to commit.
         */
        let scrolls = 0;
        scrollEl.addEventListener('scroll', () => {
          if (++scrolls === 5) {
            picker.remove();
          }
        });

        scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });

        // Long enough that any pending commit has resolved.
        await new Promise((resolve) => setTimeout(resolve, 600));

        return recorded;
      });

      expect(changes).toEqual([]);
    });

    /**
     * A scroll the column starts itself is not a selection the user has made, so
     * an outside press during one must not freeze it or commit an option it is
     * only passing through.
     */
    test('should not commit an option that a programmatic scroll is passing through', async ({ page }) => {
      await page.evaluate(() => {
        const col = document.querySelector('ion-picker-column') as any;
        const w = window as any;

        w.changes = [];
        col.addEventListener('ionChange', (ev: any) => w.changes.push(ev.detail.value));

        col.value = '150';
      });

      // Wait until the column is part way to the option that was just set.
      await page.waitForFunction(
        () => {
          const highlighted = document.querySelector('ion-picker-column .option-active') as any;
          return highlighted !== null && highlighted.value !== '5' && highlighted.value !== '150';
        },
        undefined,
        { timeout: 5000 }
      );

      await page.locator('#save').click();

      // Long enough that any pending commit has resolved.
      await page.waitForTimeout(600);

      const result = await page.evaluate(() => ({
        value: (document.querySelector('ion-picker-column') as any).value,
        changes: (window as any).changes,
      }));

      // Setting the value property must not emit ionChange.
      expect(result.changes).toEqual([]);

      // The column must still be headed for the option the application asked for.
      expect(result.value).toBe('150');
    });

    /**
     * Selecting an option directly scrolls the column to it. That scroll belongs
     * to the selection the user already made, so an outside press during it must
     * not redirect the value to an option on the way.
     */
    test('should not commit an option that a selected scroll is passing through', async ({ page }) => {
      await page.evaluate(() => {
        const col = document.querySelector('ion-picker-column') as any;
        const w = window as any;

        w.changes = [];
        col.addEventListener('ionChange', (ev: any) => w.changes.push(ev.detail.value));
      });

      // A press that selects the option already under the highlight, so nothing scrolls yet.
      await pressColumn(page);

      // Stands in for tapping an option far down the column.
      await page.evaluate(() => (document.querySelector('ion-picker-column') as any).setValue('150'));

      // Wait until the column is part way to the option that was selected.
      await page.waitForFunction(
        () => {
          const highlighted = document.querySelector('ion-picker-column .option-active') as any;
          return highlighted !== null && highlighted.value !== '5' && highlighted.value !== '150';
        },
        undefined,
        { timeout: 5000 }
      );

      await page.locator('#save').click();

      // Long enough that any pending commit has resolved.
      await page.waitForTimeout(600);

      const result = await page.evaluate(() => ({
        value: (document.querySelector('ion-picker-column') as any).value,
        changes: (window as any).changes,
      }));

      // Only the selection itself is committed, not an option on the way to it.
      expect(result.changes).toEqual(['150']);
      expect(result.value).toBe('150');
    });
  });
});
