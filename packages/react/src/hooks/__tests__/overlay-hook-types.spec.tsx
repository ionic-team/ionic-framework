import type React from 'react';

import type { useIonModal } from '../useIonModal';
import type { useIonPopover } from '../useIonPopover';

type OverlayComponentProps = {
  title: string;
  count?: number;
};

declare const ModalComponent: React.FC<OverlayComponentProps>;
declare const PopoverComponent: React.ComponentClass<OverlayComponentProps>;
declare const modalElement: JSX.Element;
declare const useIonModalForTypeTest: typeof useIonModal;
declare const useIonPopoverForTypeTest: typeof useIonPopover;

function expectOverlayHookTypes() {
  useIonModalForTypeTest(ModalComponent, { title: 'Modal', count: 1 });
  useIonPopoverForTypeTest(PopoverComponent, { title: 'Popover', count: 1 });

  useIonModalForTypeTest(ModalComponent);
  useIonPopoverForTypeTest(PopoverComponent);

  useIonModalForTypeTest(modalElement, { anything: true });

  // @ts-expect-error component props should match the modal component
  useIonModalForTypeTest(ModalComponent, { count: 1 });

  // @ts-expect-error component props should match the popover component
  useIonPopoverForTypeTest(PopoverComponent, { count: 1 });

  // @ts-expect-error unknown props should not be accepted for typed components
  useIonModalForTypeTest(ModalComponent, { title: 'Modal', unknown: true });
}

void expectOverlayHookTypes;

describe('overlay hook types', () => {
  it('type checks component props', () => {
    expect(true).toBe(true);
  });
});
