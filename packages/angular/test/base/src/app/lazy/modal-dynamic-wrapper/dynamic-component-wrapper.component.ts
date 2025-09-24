import { Component, ComponentRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  selector: 'app-dynamic-component-wrapper',
  template: `
    <ion-content>
      <ng-container #container></ng-container>
    </ion-content>
  `,
  standalone: false
})
export class DynamicComponentWrapperComponent implements OnInit, OnDestroy {

  @Input() componentRef?: ComponentRef<unknown>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  ngOnInit(): void {
    if (this.componentRef) {
      this.container.insert(this.componentRef.hostView);
    }
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}
