import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-group-inputs-page',
  templateUrl: './group-inputs-page.component.html',
  styleUrls: ['./group-inputs-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GroupInputsPageComponent implements OnInit {
  radioValue = 'tripe';

  constructor() {}

  ngOnInit() {}
}
