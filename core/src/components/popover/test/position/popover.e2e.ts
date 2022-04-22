import { expect } from '@playwright/test';
import type { E2EPage} from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

test.describe('popover: position', async () => {
  test('should render correctly', async ({ page }, testInfo) => {
    const isRTL = testInfo.project.metadata.rtl;

    await testPopover(page, 'top', 'start', isRTL);
    await testPopover(page, 'top', 'center', isRTL);
    await testPopover(page, 'top', 'end', isRTL);
    await testPopover(page, 'right', 'start', isRTL);
    await testPopover(page, 'right', 'center', isRTL);
    await testPopover(page, 'right', 'end', isRTL);
    await testPopover(page, 'bottom', 'start', isRTL);
    await testPopover(page, 'bottom', 'center', isRTL);
    await testPopover(page, 'bottom', 'end', isRTL);
    await testPopover(page, 'left', 'start', isRTL);
    await testPopover(page, 'left', 'center', isRTL);
    await testPopover(page, 'left', 'end', isRTL);
    await testPopover(page, 'start', 'start', isRTL);
    await testPopover(page, 'start', 'center', isRTL);
    await testPopover(page, 'start', 'end', isRTL);
    await testPopover(page, 'end', 'start', isRTL);
    await testPopover(page, 'end', 'center', isRTL);
    await testPopover(page, 'end', 'end', isRTL);
  });
});

const testPopover = async (page: E2EPage, side: string, alignment: string, isRTL: boolean) => {
  const POPOVER_CLASS = `${side}-${alignment}-popover`;
  const TRIGGER_ID = `${side}-${alignment}`;
  
  await screenshotPopover(page, TRIGGER_ID, 'position');
  await testSideAndAlign(page, POPOVER_CLASS, TRIGGER_ID, side, alignment, isRTL);
};

const testSideAndAlign = async (page: E2EPage, popoverClass: string, triggerID: string, side: string, alignment: string, isRTL: boolean) => {
  await page.goto('/src/components/popover/test/position');
  
  // check for null manually to avoid needing to use "!" to assert every time
  const popoverContent = page.locator(`.${popoverClass} .popover-content`);
  const popoverBbox = (await popoverContent.boundingBox()) as BoundingBox;
  expect(popoverBbox).not.toBeNull();

  const trigger = page.locator(`#${triggerID}`);
  const triggerBbox = (await trigger.boundingBox()) as BoundingBox;
  expect(triggerBbox).not.toBeNull();

  const actualX = popoverBbox.x;
  const actualY = popoverBbox.y;

  let expectedX: number | null = null;
  let expectedY: number | null = null;

  switch (side) {
    case 'top':
      expectedX = triggerBbox.x;
      expectedY = triggerBbox.y - popoverBbox.height;
      break;
    case 'right':
      expectedX = triggerBbox.x + triggerBbox.width;
      expectedY = triggerBbox.y;
      break;
    case 'bottom':
      expectedX = triggerBbox.x;
      expectedY = triggerBbox.y + triggerBbox.height;
      break;
    case 'left':
      expectedX = triggerBbox.x - popoverBbox.width;
      expectedY = triggerBbox.y;
      break;
    case 'start':
      expectedX = isRTL ? triggerBbox.x + triggerBbox.width : triggerBbox.x - popoverBbox.width;
      expectedY = triggerBbox!.y;
      break;
    case 'end':
      expectedX = isRTL ? triggerBbox.x - popoverBbox.width : triggerBbox.x + triggerBbox.width;
      expectedY = triggerBbox.y;
      break;
    default:
      break;
  }

  expect(expectedX).not.toBeNull();
  expect(expectedY).not.toBeNull();

  switch (alignment) {
    case 'center':
      const centerAlign = getCenterAlign(side, triggerBbox!, popoverBbox!);
      expectedX! += centerAlign.left;
      expectedY! += centerAlign.top;
      break;
    case 'end':
      const endAlign = getEndAlign(side, triggerBbox, popoverBbox);
      expectedX! += endAlign.left;
      expectedY! += endAlign.top;
      break;
    case 'start':
    default:
      break;
  }

  expect(Math.abs(actualX - expectedX!)).toBeLessThanOrEqual(2);
  expect(Math.abs(actualY - expectedY!)).toBeLessThanOrEqual(2);
};

const getEndAlign = (side: string, triggerBbox: BoundingBox, popoverBbox: BoundingBox) => {
  switch (side) {
    case 'start':
    case 'end':
    case 'left':
    case 'right':
      return {
        top: -(popoverBbox.height - triggerBbox.height),
        left: 0,
      };
    case 'top':
    case 'bottom':
    default:
      return {
        top: 0,
        left: -(popoverBbox.width - triggerBbox.width),
      };
  }
};

const getCenterAlign = (side: string, triggerBbox: BoundingBox, popoverBbox: BoundingBox) => {
  switch (side) {
    case 'start':
    case 'end':
    case 'left':
    case 'right':
      return {
        top: -(popoverBbox.height / 2 - triggerBbox.height / 2),
        left: 0,
      };
    case 'top':
    case 'bottom':
    default:
      return {
        top: 0,
        left: -(popoverBbox.width / 2 - triggerBbox.width / 2),
      };
  }
};

interface BoundingBox {
  x: number,
  y: number,
  width: number,
  height: number
};