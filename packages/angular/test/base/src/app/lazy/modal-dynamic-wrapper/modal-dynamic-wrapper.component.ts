import { Component, ComponentRef, OnDestroy, ViewChild, ViewContainerRef } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { DynamicComponentWrapperComponent } from "./dynamic-component-wrapper.component";
import { DynamicModalContentComponent } from "./dynamic-modal-content.component";

@Component({
  selector: 'app-modal-dynamic-wrapper',
  templateUrl: './modal-dynamic-wrapper.component.html',
  standalone: false
})
export class ModalDynamicWrapperComponent implements OnDestroy {

  @ViewChild('modalHost', { read: ViewContainerRef, static: true }) modalHost!: ViewContainerRef;

  backgroundActionCount = 0;

  private currentModal?: HTMLIonModalElement;
  private currentComponentRef?: ComponentRef<DynamicModalContentComponent>;

  constructor(private modalCtrl: ModalController) {}

  async openModal() {
    await this.closeModal();

    const componentRef = this.modalHost.createComponent(DynamicModalContentComponent);
    this.modalHost.detach();
    componentRef.instance.dismiss.subscribe(() => this.closeModal());

    this.currentComponentRef = componentRef;

    const modal = await this.modalCtrl.create({
      component: DynamicComponentWrapperComponent,
      componentProps: {
        componentRef
      },
      breakpoints: [0, 0.2, 0.75, 1],
      initialBreakpoint: 0.2,
      backdropDismiss: false,
      focusTrap: false,
      handleBehavior: 'cycle'
    });

    this.currentModal = modal;

    modal.onWillDismiss().then(() => this.destroyComponent());

    await modal.present();
  }

  async openFocusedModal() {
    await this.closeModal();

    const componentRef = this.modalHost.createComponent(DynamicModalContentComponent);
    this.modalHost.detach();
    componentRef.instance.dismiss.subscribe(() => this.closeModal());

    this.currentComponentRef = componentRef;

    const modal = await this.modalCtrl.create({
      component: DynamicComponentWrapperComponent,
      componentProps: {
        componentRef,
      },
      // Choose a higher initial breakpoint to ensure backdrop is active immediately
      breakpoints: [0, 0.25, 0.5, 0.75, 1],
      initialBreakpoint: 0.5,
      // Keep backdrop active but do not dismiss on tap to avoid interfering with assertions
      backdropDismiss: false,
      // Explicitly enable focus trapping to block background interaction
      focusTrap: true,
      handleBehavior: 'cycle',
    });

    this.currentModal = modal;

    modal.onWillDismiss().then(() => this.destroyComponent());

    await modal.present();
  }

  async closeModal() {
    if (this.currentModal) {
      await this.currentModal.dismiss();
      this.currentModal = undefined;
    }

    this.destroyComponent();
  }

  private destroyComponent() {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = undefined;
    }
  }

  onBackgroundActionClick() {
    this.backgroundActionCount++;
  }

  ngOnDestroy(): void {
    this.destroyComponent();
  }
}
