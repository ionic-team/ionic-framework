import { AfterViewInit, Component } from "@angular/core";

/**
 * Validates that inline modals will correctly display
 * dynamic contents that are updated after the modal is
 * display.
 */
@Component({
  selector: 'app-modal-inline',
  templateUrl: 'modal-inline.component.html'
})
export class ModalInlineComponent implements AfterViewInit {

  items: string[] = [];

  breakpointWillChangeCounter = 0;
  breakpointDidChangeCounter = 0;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.items = ['A', 'B', 'C', 'D'];
    }, 1000);
  }

  onBreakpointWillChange() {
    this.breakpointWillChangeCounter++;
  }

  onBreakpointDidChange() {
    this.breakpointDidChangeCounter++;
  }
}
