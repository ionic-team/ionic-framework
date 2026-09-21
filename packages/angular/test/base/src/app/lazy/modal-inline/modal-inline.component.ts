import { AfterViewInit, ChangeDetectorRef, Component } from "@angular/core";

/**
 * Validates that inline modals will correctly display
 * dynamic contents that are updated after the modal is
 * display.
 */
@Component({
  selector: 'app-modal-inline',
  templateUrl: 'modal-inline.component.html',
  standalone: false
})
export class ModalInlineComponent implements AfterViewInit {

  items: string[] = [];

  breakpointDidChangeCounter = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.items = ['A', 'B', 'C', 'D'];
      // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own; mark the view dirty.
      this.cdr.markForCheck();
    }, 1000);
  }

  onBreakpointDidChange() {
    this.breakpointDidChangeCounter++;
  }

}
