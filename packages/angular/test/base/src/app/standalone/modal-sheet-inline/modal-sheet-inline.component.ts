import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
} from '@ionic/angular/standalone';

interface Contact {
  name: string;
  title: string;
  avatar: string;
}

@Component({
  selector: 'app-modal-sheet-inline',
  templateUrl: './modal-sheet-inline.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonAvatar,
    IonButton,
    IonContent,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonSearchbar,
  ],
})
export class ModalSheetInlineComponent {
  @ViewChild('inlineSheetModal', { read: IonModal }) inlineSheetModal?: IonModal;

  readonly breakpoints: number[] = [0, 0.2, 0.75, 1];

  readonly contacts: Contact[] = [
    {
      name: 'Connor Smith',
      title: 'Sales Rep',
      avatar: 'https://i.pravatar.cc/300?u=b',
    },
    {
      name: 'Daniel Smith',
      title: 'Product Designer',
      avatar: 'https://i.pravatar.cc/300?u=a',
    },
    {
      name: 'Greg Smith',
      title: 'Director of Operations',
      avatar: 'https://i.pravatar.cc/300?u=d',
    },
    {
      name: 'Zoey Smith',
      title: 'CEO',
      avatar: 'https://i.pravatar.cc/300?u=e',
    },
  ];

  isSheetOpen = false;

  currentBreakpoint = 'closed';

  backgroundActionCount = 0;

  presentInlineSheetModal() {
    this.isSheetOpen = true;
    this.currentBreakpoint = '0.2';
  }

  async expandInlineSheet() {
    const modal = this.inlineSheetModal;

    if (!modal) {
      return;
    }

    await modal.setCurrentBreakpoint(0.75);
    this.currentBreakpoint = '0.75';
  }

  onSheetDidDismiss() {
    this.isSheetOpen = false;
    this.currentBreakpoint = 'closed';
  }

  onSheetBreakpointDidChange(event: CustomEvent<{ breakpoint: number }>) {
    this.currentBreakpoint = event.detail.breakpoint.toString();
  }

  onBackgroundActionClick() {
    this.backgroundActionCount++;
  }
}
