import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { FrameworkDelegate, FrameworkMountingData } from '@ionic/core';

import { AngularComponentMounter } from '../providers/angular-component-mounter';
import { ModalController } from '../providers/modal-controller';
import { ModalDelegate } from '../types/interfaces';

@Component({
  selector: 'ion-modal-container',
  template: `
<ion-modal [delegateModalWrapper]="true" *ngIf="showModal" [delegate]="self" >
  <div #modalWrapper [attr.role]="role" [ngClass]="classes">
    <div #viewport></div>
  </div>
</ion-modal>
  `
})
export class ModalContainer implements FrameworkDelegate, ModalDelegate {

  self = this;
  showModal: boolean;
  isHydrated: boolean;
  role: string;
  classes: string[];

  @ViewChild('modalWrapper', { read: ElementRef }) modalWrapper: ElementRef;
  @ViewChild('viewport', { read: ViewContainerRef }) viewport: ViewContainerRef;

  constructor(private angularComponentMounter: AngularComponentMounter,
    private componentResolveFactory: ComponentFactoryResolver,
    modalController: ModalController) {

    modalController.delegate = this;
  }

  attachViewToDom(_elementOrContainerToMountTo: HTMLElement, elementOrComponentToMount: Type<any>,
    _propsOrDataObj?: any, classesToAdd?: string[]): Promise<FrameworkMountingData> {

    // since we're doing a custom mounting of the component, the container to mount to is null by default in this case.
    return this.angularComponentMounter.attachViewToDom(this.modalWrapper.nativeElement, elementOrComponentToMount, this.componentResolveFactory, null, this.viewport, classesToAdd);
  }

  removeViewFromDom(_parentElement: HTMLElement, childElement: any): Promise<FrameworkMountingData> {

    return this.angularComponentMounter.removeViewFromDom(childElement);
  }

}

