import { AfterViewInit, Component } from "@angular/core";

/**
 * Validates that inline modals will correctly display
 * dynamic contents that are updated after the modal is
 * display.
 */
@Component({
  selector: 'app-overlay-auto-mount',
  templateUrl: 'overlay-auto-mount.component.html'
})
export class OverlayAutoMountComponent implements AfterViewInit {

  items: string[] = [];

  breakpointDidChangeCounter = 0;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.items = ['A', 'B', 'C', 'D'];
    }, 1000);
  }

  onBreakpointDidChange() {
    this.breakpointDidChangeCounter++;
  }
}
