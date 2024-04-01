import {
  readTask,
  writeTask,
} from '@stencil/core';

import {
  findClosestIonContent,
  scrollToTop,
} from './content';
import { componentOnReady } from './helpers';

export const startStatusTap = () => {
  const win = window;
  win.addEventListener(
    'statusTap',
    () => {
      readTask(() => {
        const width = win.innerWidth;
        const height = win.innerHeight;
        const el =
          document.elementFromPoint(
            width / 2,
            height / 2
          ) as Element | null;
        if (!el) {
          return;
        }
        const contentEl =
          findClosestIonContent(el);
        if (contentEl) {
          new Promise((resolve) =>
            componentOnReady(
              contentEl,
              resolve
            )
          ).then(() => {
            writeTask(async () => {
              /**
               * If scrolling and user taps status bar,
               * only calling scrollToTop is not enough
               * as engines like WebKit will jump the
               * scroll position back down and complete
               * any in-progress momentum scrolling.
               */
              contentEl.style.setProperty(
                '--overflow',
                'hidden'
              );

              await scrollToTop(
                contentEl,
                300
              );

              contentEl.style.removeProperty(
                '--overflow'
              );
            });
          });
        }
      });
    }
  );
};
