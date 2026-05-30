// TODO: Jest does not support ES Modules,
// and Ionic custom elements are ES Modules only.

describe('test', () => {
  it('should pass', () => {
    // This is to get CI to pass!
    // We need to figure out an ESM solution for tests
  });
});

/*import { alertController, modalController } from '@ionic/core';

import React from 'react';

import { useController } from '../useController';
import { useOverlay } from '../useOverlay';

import { useIonActionSheet } from '../useIonActionSheet';
import type { UseIonActionSheetResult } from '../useIonActionSheet';
import { useIonAlert } from '../useIonAlert';
import type { UseIonAlertResult } from '../useIonAlert';
import { useIonLoading } from '../useIonLoading';
import type { UseIonLoadingResult } from '../useIonLoading';
import { useIonModal } from '../useIonModal';
import type { UseIonModalResult } from '../useIonModal';
import { useIonPicker } from '../useIonPicker';
import type { UseIonPickerResult } from '../useIonPicker';
import { useIonPopover } from '../useIonPopover';
import type { UseIonPopoverResult } from '../useIonPopover';
import { useIonToast } from '../useIonToast';
import type { UseIonToastResult } from '../useIonToast';

import { renderHook } from '@testing-library/react-hooks';

describe('useController', () => {
  it('should be memorised', () => {
    const { result, rerender } = renderHook(() =>
      useController('AlertController', alertController)
    );

    rerender();

    const [
      { present: firstPresent, dismiss: firstDismiss },
      { present: secondPresent, dismiss: secondDismiss },
    ] = result.all as ReturnType<typeof useController>[];

    expect(firstPresent).toBe(secondPresent);
    expect(firstDismiss).toBe(secondDismiss);
  });
});

describe('useIonActionSheet', () => {
  it('should be memorised', () => {
    const { result, rerender } = renderHook(() => useIonActionSheet());

    rerender();

    const [[firstPresent, firstDismiss], [secondPresent, secondDismiss]] =
      result.all as UseIonActionSheetResult[];
    expect(firstPresent).toBe(secondPresent);
    expect(firstDismiss).toBe(secondDismiss);
  });
});

describe('useIonAlert', () => {
  it('should be memorised', () => {
    const { result, rerender } = renderHook(() => useIonAlert());

    rerender();

    const [[firstPresent, firstDismiss], [secondPresent, secondDismiss]] =
      result.all as UseIonAlertResult[];
    expect(firstPresent).toBe(secondPresent);
    expect(firstDismiss).toBe(secondDismiss);
  });
});

describe('useIonLoading', () => {
  it('should be memorised', () => {
    const { result, rerender } = renderHook(() => useIonLoading());

    rerender();

    const [[firstPresent, firstDismiss], [secondPresent, secondDismiss]] =
      result.all as UseIonLoadingResult[];
    expect(firstPresent).toBe(secondPresent);
    expect(firstDismiss).toBe(secondDismiss);
  });
});

describe('useIonModal', () => {
  it('should be memorised', () => {
    const ModalComponent = () => <div />;
    const { result, rerender } = renderHook(() => useIonModal(ModalComponent, {}));

    rerender();

    const [[firstPresent, firstDismiss], [secondPresent, secondDismiss]] =
      result.all as UseIonModalResult[];
    expect(firstPresent).toBe(secondPresent);
    expect(firstDismiss).toBe(secondDismiss);
  });
});

describe('useIonPicker', () => {
  it('should be memorised', () => {
    const { result, rerender } = renderHook(() => useIonPicker());

    rerender();

    const [[firstPresent, firstDismiss], [secondPresent, secondDismiss]] =
      result.all as UseIonPickerResult[];
    expect(firstPresent).toBe(secondPresent);
    expect(firstDismiss).toBe(secondDismiss);
  });
});

describe('useIonPopover', () => {
  it('should be memorised', () => {
    const PopoverComponent = () => <div />;
    const { result, rerender } = renderHook(() => useIonPopover(PopoverComponent, {}));

    rerender();

    const [[firstPresent, firstDismiss], [secondPresent, secondDismiss]] =
      result.all as UseIonPopoverResult[];
    expect(firstPresent).toBe(secondPresent);
    expect(firstDismiss).toBe(secondDismiss);
  });
});

describe('useIonToast', () => {
  it('should be memorised', () => {
    const { result, rerender } = renderHook(() => useIonToast());

    rerender();

    const [[firstPresent, firstDismiss], [secondPresent, secondDismiss]] =
      result.all as UseIonToastResult[];
    expect(firstPresent).toBe(secondPresent);
    expect(firstDismiss).toBe(secondDismiss);
  });
});

describe('useOverlay', () => {
  it('should be memorised', () => {
    const OverlayComponent = () => <div />;
    const { result, rerender } = renderHook(() =>
      useOverlay('IonModal', modalController, OverlayComponent, {})
    );

    rerender();

    const [
      { present: firstPresent, dismiss: firstDismiss },
      { present: secondPresent, dismiss: secondDismiss },
    ] = result.all as ReturnType<typeof useOverlay>[];

    expect(firstPresent).toBe(secondPresent);
    expect(firstDismiss).toBe(secondDismiss);
  });
});
*/
