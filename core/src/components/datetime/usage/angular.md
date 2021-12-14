```html
<!-- Initial value -->
<ion-datetime value="2012-12-15T13:47:20.789"></ion-datetime>

<!-- Readonly -->
<ion-datetime readonly></ion-datetime>

<!-- Disabled -->
<ion-datetime disabled></ion-datetime>

<!-- Custom locale -->
<ion-datetime locale="en-GB"></ion-datetime>

<!-- Max and min -->
<ion-datetime min="1994-03-14" max="2012-12-09" value="2008-09-02"></ion-datetime>

<!-- 15 minute increments -->
<ion-datetime minuteValues="0,15,30,45"></ion-datetime>

<!-- Specific days/months/years --> 
<ion-datetime monthValues="6,7,8" yearValues="2014,2015" dayValues="01,02,03,04,05,06,08,09,10,11,12,13,14"></ion-datetime>

<!-- Selecting time, no date -->
<ion-datetime presentation="time"></ion-datetime>

<!-- Selecting time first, date second -->
<ion-datetime presentation="time-date"></ion-datetime>

<!-- Full width size -->
<ion-datetime size="cover"></ion-datetime>

<!-- Custom Hour Cycle -->
<ion-datetime hourCycle="h23"></ion-datetime>

<!-- Custom first day of week -->
<ion-datetime [firstDayOfWeek]="1"></ion-datetime>

<!-- Custom title -->
<ion-datetime>
  <div slot="title">My Custom Title</div>
</ion-datetime>

<!-- Clear button -->
<ion-datetime [showClearButton]="true"></ion-datetime>

<!-- Datetime in overlay -->
<ion-button id="open-modal">Open Datetime Modal</ion-button>
<ion-modal trigger="open-modal">
  <ng-template>
    <ion-content>
      <ion-datetime></ion-datetime>
    </ion-content>
  </ng-template>
</ion-modal>

<!-- Custom buttons -->
<ion-datetime>
  <ion-buttons slot="buttons">
    <ion-button (click)="confirm()">Good to go!</ion-button>
    <ion-button (click)="reset()">Reset</ion-button>
  </ion-buttons>
</ion-datetime>

<!-- Datetime in popover with cover element -->
<ion-item button="true" id="open-date-input">
  <ion-label>Date</ion-label>
  <ion-text slot="end">{{ dateValue }}</ion-text>
  <ion-popover trigger="open-date-input" show-backdrop="false">
    <ng-template>
      <ion-datetime
        #popoverDatetime
        presentation="date"
        (ionChange)="dateValue = formatDate(popoverDatetime.value)"
      ></ion-datetime>
    </ng-template>
  </ion-popover>
</ion-item>

<!-- Datetime in popover with input -->
<ion-item>
  <ion-input [value]="dateValue2"></ion-input>
  <ion-button fill="clear" id="open-date-input-2">
    <ion-icon icon="calendar"></ion-icon>
  </ion-button>
  <ion-popover trigger="open-date-input-2" show-backdrop="false">
    <ng-template>
      <ion-datetime
        #popoverDatetime2
        presentation="date"
        (ionChange)="dateValue2 = formatDate(popoverDatetime2.value)"
      ></ion-datetime>
    </ng-template>
  </ion-popover>
</ion-item>
```

```typescript
import { Component, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({…})
export class MyComponent {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  dateValue = '';
  dateValue2 = '';

  constructor() {}
  
  confirm() {
    this.datetime.nativeEl.confirm();
  }
  
  reset() {
    this.datetime.nativeEl.reset();
  }

  formatDate(value: string) {
    return format(parseISO(value), 'MMM dd yyyy');
  }
}
```