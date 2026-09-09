import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const ISSUE = 'https://github.com/ionic-team/ionic-framework/issues/31149';

/** Height of the child inside `ion-content`, so sizing can be asserted exactly. */
const CHILD_HEIGHT = 200;

/** Taller than any viewport under test, to force the overflow cases. */
const TALL_CHILD_HEIGHT = 2000;

/**
 * Delays the remount long enough to trigger a fresh evaluation, but not long
 * enough for the modal's later safe-area write to clear the stale class.
 */
const REMOUNT_TIMEOUT = 100;

/**
 * `setContent` has animations enabled by default, so `toBeVisible()` resolves as
 * the modal starts animating in and everything after it is measured
 * mid-animation. This turns animations off for each modal.
 */
const DISABLE_ANIMATIONS = `<script>window.Ionic.config.animated = false;</script>`;

const contentModal = (style: string, childHeight = CHILD_HEIGHT) => `
  ${DISABLE_ANIMATIONS}
  <style>
    ion-modal {
      ${style}
    }
  </style>
  <ion-modal is-open="true">
    <ion-content>
      <div style="height: ${childHeight}px"></div>
    </ion-content>
  </ion-modal>
`;

/**
 * Nav pages have to be registered before `ion-nav` resolves its root, and the
 * nav has to arrive through the modal's `component` delegate. An `ion-nav`
 * slotted inline renders no pages at all.
 */
const NAV_MODAL = `
  <ion-modal></ion-modal>
  <script>
    class NavPageOne extends HTMLElement {
      connectedCallback() {
        this.innerHTML = \`
          <ion-header><ion-toolbar><ion-title>One</ion-title></ion-toolbar></ion-header>
          <ion-content><div style="height: 120px"></div></ion-content>
        \`;
      }
    }
    class NavPageTwo extends HTMLElement {
      connectedCallback() {
        this.innerHTML = \`
          <ion-header><ion-toolbar><ion-title>Two</ion-title></ion-toolbar></ion-header>
          <ion-content><div id="tall-block" style="height: 400px"></div></ion-content>
        \`;
      }
    }
    class NavHost extends HTMLElement {
      connectedCallback() {
        this.innerHTML = '<ion-content><ion-nav root="nav-page-one"></ion-nav></ion-content>';
      }
    }
    customElements.define('nav-page-one', NavPageOne);
    customElements.define('nav-page-two', NavPageTwo);
    customElements.define('nav-host', NavHost);
  </script>
`;

const getContentHeight = async (page: E2EPage) => {
  const box = await page.locator('ion-modal ion-content').first().boundingBox();
  return box?.height ?? 0;
};

const getWrapperHeight = async (page: E2EPage) => {
  const box = await page.locator('ion-modal .modal-wrapper').boundingBox();
  return box?.height ?? 0;
};

/**
 * A content-sized modal has no definite height to hand down, so the scroll
 * container only scrolls if it can shrink against the modal's `--max-height`.
 * `scrollHeight > clientHeight` is what separates scrolling from clipping.
 */
const getScrollMetrics = (page: E2EPage) => {
  return page.locator('ion-modal ion-content').evaluate(async (el: HTMLIonContentElement) => {
    const scrollEl = await el.getScrollElement();
    return { scrollHeight: scrollEl.scrollHeight, clientHeight: scrollEl.clientHeight };
  });
};

/**
 * Simulates a framework-driven detach/reattach around a modal height change:
 * removes the content from the DOM, updates the modal's `--height` while the
 * content is detached, then restores it to its original parent.
 *
 * The same element has to come back for this to reach the reconnect path, the
 * way a framework moves a subtree it owns instead of rebuilding it, such as
 * Vue's `<KeepAlive>`. Conditional rendering that discards the element and
 * creates a new one is sized by that element's first render instead.
 */
const setHeightWhileDetached = (page: E2EPage, height: string) => {
  return page.locator('ion-modal').evaluate(async (el: HTMLElement, height: string) => {
    const content = el.querySelector('ion-content')!;
    const parent = content.parentElement!;

    content.remove();
    el.style.setProperty('--height', height);

    await new Promise((resolve) => setTimeout(resolve, 200));
    parent.appendChild(content);
  }, height);
};

/** Presents a nav modal through the delegate and waits for its first page. */
const presentNavModal = async (page: E2EPage) => {
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.locator('ion-modal').evaluate((modal: HTMLIonModalElement) => {
    modal.component = document.createElement('nav-host');
    return modal.present();
  });

  await ionModalDidPresent.next();
  await page.locator('ion-modal ion-nav nav-page-one').waitFor();
};

/**
 * This behavior does not vary across directions/modes
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: content height'), () => {
    test.describe('content-based heights', () => {
      /**
       * Each of these leaves the content an indefinite height to resolve
       * against, which is what used to collapse it. The content holds a single
       * fixed height child, so a correct result is exactly that height:
       * collapsed content measures 0, and a modal that ignored the height would
       * fill the screen.
       */
      const expectSizedToContent = async (page: E2EPage, height: string) => {
        await page.setContent(contentModal(`--height: ${height};`), config);
        await expect(page.locator('ion-modal')).toBeVisible();

        await expect(page.locator('ion-modal ion-content')).toHaveClass(/content-sizing/);
        await expect.poll(() => getContentHeight(page)).toBe(CHILD_HEIGHT);
      };

      test('should size the content with fit-content', async ({ page }) => {
        test.info().annotations.push({ type: 'issue', description: ISSUE });

        await expectSizedToContent(page, 'fit-content');
      });

      test('should size the content with auto', async ({ page }) => {
        test.info().annotations.push({ type: 'issue', description: ISSUE });

        await expectSizedToContent(page, 'auto');
      });

      test('should size the content with min-content', async ({ page }) => {
        test.info().annotations.push({ type: 'issue', description: ISSUE });

        await expectSizedToContent(page, 'min-content');
      });

      test('should size the content with max-content', async ({ page }) => {
        test.info().annotations.push({ type: 'issue', description: ISSUE });

        await expectSizedToContent(page, 'max-content');
      });

      test('should size the content with a prefixed fit-content', async ({ page }) => {
        /**
         * Firefox only took `fit-content` unprefixed in 94, so a value carrying
         * only the `-moz-` prefix still has to be recognized.
         */
        await expectSizedToContent(page, '-moz-fit-content');
      });

      test('should size the content with an uppercase keyword', async ({ page }) => {
        /**
         * CSS property values are case-insensitive, so `FIT-CONTENT` should
         * size the modal to its content just like the lowercase value.
         */
        await expectSizedToContent(page, 'FIT-CONTENT');
      });
    });

    test.describe('definite heights', () => {
      test('should fill the screen with the default height', async ({ page }) => {
        await page.setContent(contentModal(''), config);
        await expect(page.locator('ion-modal')).toBeVisible();

        const viewport = page.viewportSize()!;

        // Content sizing should not be applied by default.
        await expect(page.locator('ion-modal ion-content')).not.toHaveClass(/content-sizing/);
        await expect.poll(() => getContentHeight(page)).toBe(viewport.height);
      });

      test('should fill and scroll a pixel height', async ({ page }) => {
        await page.setContent(contentModal('--height: 300px;', TALL_CHILD_HEIGHT), config);
        await expect(page.locator('ion-modal')).toBeVisible();

        // A definite height is not content-sized, so the ion-content
        // should fill the modal the way it always has.
        await expect(page.locator('ion-modal ion-content')).not.toHaveClass(/content-sizing/);
        await expect.poll(() => getWrapperHeight(page)).toBe(300);

        const { scrollHeight, clientHeight } = await getScrollMetrics(page);
        expect(clientHeight).toBe(300);
        expect(scrollHeight).toBeGreaterThan(clientHeight);
      });

      test('should clamp a pixel height taller than the overlay', async ({ page }) => {
        await page.setContent(contentModal('--height: 2000px;'), config);
        await expect(page.locator('ion-modal')).toBeVisible();

        const viewport = page.viewportSize()!;

        // 2000px exceeds the overlay, so the default --max-height: 100% should
        // clamp the height rather than letting it run off screen.
        await expect.poll(() => getWrapperHeight(page)).toBe(viewport.height);
      });
    });

    test.describe('overflowing content', () => {
      test('should scroll rather than overflow the screen', async ({ page }) => {
        await page.setContent(contentModal('--height: fit-content;', TALL_CHILD_HEIGHT), config);
        await expect(page.locator('ion-modal')).toBeVisible();

        const viewport = page.viewportSize()!;

        // The default --max-height keeps a content-sized modal inside the
        // overlay. Rounded up by one, since the clamp lands on a sub-pixel.
        expect(await getWrapperHeight(page)).toBeLessThanOrEqual(viewport.height + 1);

        // The content shrinks to reach that cap, leaving the child scrollable.
        const { scrollHeight, clientHeight } = await getScrollMetrics(page);
        expect(scrollHeight).toBeGreaterThan(clientHeight);
      });

      test('should honor a smaller --max-height', async ({ page }) => {
        await page.setContent(contentModal('--height: fit-content; --max-height: 50%;', TALL_CHILD_HEIGHT), config);
        await expect(page.locator('ion-modal')).toBeVisible();

        const viewport = page.viewportSize()!;

        // Setting --max-height to 50% should shrink the modal to half the
        // viewport, rounded up by one.
        expect(await getWrapperHeight(page)).toBeLessThanOrEqual(viewport.height * 0.5 + 1);

        // The content shrinks to reach that cap, leaving the child scrollable.
        const { scrollHeight, clientHeight } = await getScrollMetrics(page);
        expect(scrollHeight).toBeGreaterThan(clientHeight);
      });
    });

    test.describe('structure and reactivity', () => {
      test('should size a modal that has no ion-content', async ({ page }) => {
        await page.setContent(
          `
          ${DISABLE_ANIMATIONS}
          <style>
            ion-modal {
              --height: fit-content;
            }
          </style>
          <ion-modal is-open="true">
            <div style="height: ${CHILD_HEIGHT}px"></div>
          </ion-modal>
        `,
          config
        );
        await expect(page.locator('ion-modal')).toBeVisible();

        // Sized through `ion-modal > .ion-page` alone, with none of the
        // content-sizing detection involved.
        await expect(page.locator('ion-modal ion-content')).toHaveCount(0);
        await expect.poll(() => getWrapperHeight(page)).toBe(CHILD_HEIGHT);
      });

      test('should size a modal around an ion-nav and follow it between pages', async ({ page }) => {
        await page.setContent(`<style>ion-modal { --height: fit-content; }</style>${NAV_MODAL}`, config);
        await presentNavModal(page);

        // Without the nav being positioned relatively it has no intrinsic
        // height, so the modal would be 0.
        const pageOneHeight = await getWrapperHeight(page);
        expect(pageOneHeight).toBeGreaterThan(100);

        // Page two is taller, so the modal grows to follow the active page.
        await page.locator('ion-modal ion-nav').evaluate((nav: HTMLIonNavElement) => nav.push('nav-page-two'));
        await page.locator('ion-modal #tall-block').waitFor();

        expect(await getWrapperHeight(page)).toBeGreaterThan(pageOneHeight);
      });

      test('should overlap nav pages mid-transition rather than stack them', async ({ page }) => {
        /**
         * The nav fixture keeps animations enabled so both pages are in the
         * tree at once during the transition, which is what makes it possible
         * to catch them laid out one below the other.
         */
        await page.setContent(`<style>ion-modal { --height: fit-content; }</style>${NAV_MODAL}`, config);
        await presentNavModal(page);

        const tops = await page.locator('ion-modal ion-nav').evaluate(async (nav: HTMLIonNavElement) => {
          const pushed = nav.push('nav-page-two');

          /**
           * Both pages are in the tree from the first frame of the transition,
           * which runs for around half a second, so one frame is enough to
           * catch them together. A page that has been hidden reports a zero
           * rect, so only pages with a real box count.
           */
          await new Promise((resolve) => requestAnimationFrame(resolve));
          const laidOut = Array.from(nav.children).filter((child) => child.getBoundingClientRect().height > 0);
          const tops = laidOut.map((child) => Math.round(child.getBoundingClientRect().top));

          // Awaiting the push surfaces a rejected transition as a test failure.
          await pushed;

          return tops;
        });

        // Both pages are laid out during the slide and must share an origin.
        expect(tops).toHaveLength(2);
        expect(new Set(tops).size).toBe(1);
      });

      /**
       * Nav pages carried these properties once before, at `height: 100%`, and
       * it left titles animating to the wrong place (#25677, #25688). This
       * covers where a transition ends up, with the arriving page and its title
       * resting against the modal.
       */
      test('should settle a nav transition with the new page in place', async ({ page }) => {
        await page.setContent(`<style>ion-modal { --height: fit-content; }</style>${NAV_MODAL}`, config);
        await presentNavModal(page);

        // Awaiting the push resolves once the transition is done.
        await page.locator('ion-modal ion-nav').evaluate((nav: HTMLIonNavElement) => nav.push('nav-page-two'));

        const arrived = page.locator('ion-modal nav-page-two');
        await expect(arrived.locator('ion-title')).toBeVisible();
        await expect(page.locator('ion-modal nav-page-one')).toBeHidden();

        // A page left mid-slide still has a box, so the box has to line up with
        // the modal on both axes for the transition to have actually landed.
        const pageBox = (await arrived.boundingBox())!;
        const wrapperBox = (await page.locator('ion-modal .modal-wrapper').boundingBox())!;
        expect(pageBox.x).toBeCloseTo(wrapperBox.x, 0);
        expect(pageBox.y).toBeCloseTo(wrapperBox.y, 0);
        expect(pageBox.height).toBeGreaterThan(0);

        // The title drifting down the viewport is the reported symptom, so it
        // has to come to rest against the top of the modal.
        const titleBox = (await arrived.locator('ion-title').boundingBox())!;
        expect(titleBox.y).toBeCloseTo(wrapperBox.y, 0);

        // Going back has to land the same way, since the pop animates too.
        await page.locator('ion-modal ion-nav').evaluate((nav: HTMLIonNavElement) => nav.pop());

        await expect(page.locator('ion-modal nav-page-one ion-title')).toBeVisible();
        await expect(arrived).toBeHidden();
        expect((await page.locator('ion-modal nav-page-one').boundingBox())!.x).toBeCloseTo(wrapperBox.x, 0);
      });

      test('should respect a --height set on the modal at runtime', async ({ page }) => {
        await page.setContent(contentModal(''), config);
        await expect(page.locator('ion-modal')).toBeVisible();

        const viewport = page.viewportSize()!;
        const modal = page.locator('ion-modal');
        const content = page.locator('ion-modal ion-content');

        // No --height of its own, so the modal is on its default full height.
        await expect(content).not.toHaveClass(/content-sizing/);
        await expect.poll(() => getWrapperHeight(page)).toBe(viewport.height);

        // Set the --height and verify the observer is picking it up and
        // adding the content-sizing class to the content.
        await modal.evaluate((el: HTMLElement) => el.style.setProperty('--height', 'fit-content'));
        await expect(content).toHaveClass(/content-sizing/);
        await expect.poll(() => getContentHeight(page)).toBe(CHILD_HEIGHT);

        // Removing it falls back to the default, so a class left behind in
        // either direction is caught.
        await modal.evaluate((el: HTMLElement) => el.style.removeProperty('--height'));
        await expect(content).not.toHaveClass(/content-sizing/);
        await expect.poll(() => getWrapperHeight(page)).toBe(viewport.height);
      });

      test('should respect a --height that changed while the content was detached', async ({ page }) => {
        await page.setContent(contentModal(''), config);
        await expect(page.locator('ion-modal')).toBeVisible();

        const viewport = page.viewportSize()!;
        const content = page.locator('ion-modal ion-content');

        // Coming back to a content-based height should size the content to its
        // child rather than collapse it.
        await setHeightWhileDetached(page, 'fit-content');
        await expect(content).toHaveClass(/content-sizing/, { timeout: REMOUNT_TIMEOUT });
        await expect.poll(() => getContentHeight(page)).toBe(CHILD_HEIGHT);

        // Coming back to a definite height should fill the modal again, so a
        // class left behind in either direction is caught.
        await setHeightWhileDetached(page, '100%');
        await expect(content).not.toHaveClass(/content-sizing/, { timeout: REMOUNT_TIMEOUT });
        await expect.poll(() => getWrapperHeight(page)).toBe(viewport.height);
      });
    });
  });
});
