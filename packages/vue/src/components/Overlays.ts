import {
  JSX,
  alertController,
  actionSheetController,
  loadingController,
  modalController,
  pickerController,
  popoverController,
  toastController
} from '@ionic/core';
import { FunctionalComponent, defineComponent, h, ref } from 'vue';
import {
  IonAlert as IonAlertCmp,
  IonActionSheet as IonActionSheetCmp,
  IonLoading as IonLoadingCmp,
  IonModal as IonModalCmp,
  IonPicker as IonPickerCmp,
  IonPopover as IonPopoverCmp,
  IonToast as IonToastCmp
} from '../';

interface OverlayProps {
  isOpen?: boolean;
}

const defineOverlayContainer = <Props extends object>(name: string, componentProps: string[] = [], controller: any) => {
  // TODO
  const eventPrefix = name.toLowerCase().split('-').join('');
  const eventListeners = [
    { componentEv: `${eventPrefix}willpresent`, frameworkEv: 'onWillPresent' },
    { componentEv: `${eventPrefix}didpresent`, frameworkEv: 'onDidPresent' },
    { componentEv: `${eventPrefix}willdismiss`, frameworkEv: 'onWillDismiss' },
    { componentEv: `${eventPrefix}diddismiss`, frameworkEv: 'onDidDismiss' },
  ];

  const Container: FunctionalComponent<Props & OverlayProps> = defineComponent((props, { slots, emit }) => {
    const overlay = ref();
    const content = ref();

    const onVnodeMounted = async () => {
      const isOpen = props.isOpen;
      isOpen && (await present(props))
    }

    const onVnodeUpdated = async () => {
      const isOpen = props.isOpen;
      if (isOpen) {
        await overlay.value?.present() || present(props);
      } else {
        await overlay.value?.dismiss();
        overlay.value = undefined;
      }
    }

    const onVnodeBeforeUnmount = async () => {
      await overlay.value?.dismiss();
      overlay.value = undefined;
    }

    const present = async (props: Readonly<Props>) => {
      overlay.value = await controller.create({
        ...props,
        component: content.value
      });

      eventListeners.forEach(eventListener => {
        overlay.value.addEventListener(eventListener.componentEv, () => {
          emit(eventListener.frameworkEv);
        });
      })

      await overlay.value.present();
    }

    return () => {
      return h(
        'div',
        {
          style: { display: 'none' },
          onVnodeMounted,
          onVnodeUpdated,
          onVnodeBeforeUnmount
        },
        [h('div', { ref: content }, slots.default && slots.default())]
      );
    }
  });

  Container.displayName = name;
  Container.props = [...componentProps, 'isOpen'];
  Container.emits = eventListeners.map(ev => ev.frameworkEv);

  return Container;
}

export const IonAlert = /*@__PURE__*/defineOverlayContainer<JSX.IonAlert>(IonAlertCmp.displayName, IonAlertCmp.componentProps, alertController);
export const IonActionSheet = /*@__PURE__*/defineOverlayContainer<JSX.IonActionSheet>(IonActionSheetCmp.displayName, IonActionSheetCmp.componentProps, actionSheetController);
export const IonLoading = /*@__PURE__*/defineOverlayContainer<JSX.IonLoading>(IonLoadingCmp.displayName, IonLoadingCmp.componentProps, loadingController);
export const IonModal = /*@__PURE__*/defineOverlayContainer<JSX.IonModal>(IonModalCmp.displayName, IonModalCmp.componentProps, modalController);
export const IonPicker = /*@__PURE__*/defineOverlayContainer<JSX.IonPicker>(IonPickerCmp.displayName, IonPickerCmp.componentProps, pickerController);
export const IonPopover = /*@__PURE__*/defineOverlayContainer<JSX.IonPopover>(IonPopoverCmp.displayName, IonPopoverCmp.componentProps, popoverController);
export const IonToast = /*@__PURE__*/defineOverlayContainer<JSX.IonToast>(IonToastCmp.displayName, IonToastCmp.componentProps, toastController);
