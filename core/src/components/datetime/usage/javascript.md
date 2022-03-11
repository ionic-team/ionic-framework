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
<ion-datetime minute-values="0,15,30,45"></ion-datetime>

<!-- Specific days/months/years --> 
<ion-datetime month-values="6,7,8" year-values="2014,2015" day-values="01,02,03,04,05,06,08,09,10,11,12,13,14"></ion-datetime>

<!-- Selecting time, no date -->
<ion-datetime presentation="time"></ion-datetime>

<!-- Selecting time first, date second -->
<ion-datetime presentation="time-date"></ion-datetime>

<!-- Full width size -->
<ion-datetime size="cover"></ion-datetime>

<!-- Custom Hour Cycle -->
<ion-datetime hour-cycle="h23"></ion-datetime>

<!-- Custom first day of week -->
<ion-datetime first-day-of-week="1"></ion-datetime>

<!-- Custom title -->
<ion-datetime>
  <div slot="title">My Custom Title</div>
</ion-datetime>

<!-- Clear button -->
<ion-datetime show-clear-button="true"></ion-datetime>

<!-- Custom buttons -->
<ion-datetime id="custom-datetime">
  <ion-buttons slot="buttons">
    <ion-button onclick="confirm()">Good to go!</ion-button>
    <ion-button onclick="reset()">Reset</ion-button>
  </ion-buttons>
</ion-datetime>

<!-- Disable custom dates -->
<ion-datetime id="disabled-date-datetime"></ion-datetime>

<!-- Datetime in overlay -->
<ion-button id="open-modal">Open Datetime Modal</ion-button>
<ion-modal trigger="open-modal">
  <ion-content>
    <ion-datetime></ion-datetime>
  </ion-content>
</ion-modal>

<!-- Datetime in popover with cover element -->
<ion-item button="true" id="open-date-input">
  <ion-label>Date</ion-label>
  <ion-text slot="end" id="date-input"></ion-text>
  <ion-popover trigger="open-date-input" show-backdrop="false">
    <ion-datetime presentation="date" id="popover-datetime"></ion-datetime>
  </ion-popover>
</ion-item>

<!-- Datetime in popover with input -->
<ion-item>
  <ion-input id="date-input-2"></ion-input>
  <ion-button slot="end" fill="clear" id="open-date-input-2">
    <ion-icon icon="calendar"></ion-icon>
  </ion-button>
  <ion-popover trigger="open-date-input-2" show-backdrop="false">
    <ion-datetime presentation="date" id="popover-datetime-2"></ion-datetime>
  </ion-popover>
</ion-item>
```

```javascript
import { format, parseISO, getDate, getMonth, getYear } from 'date-fns';

const datetime = document.querySelector('#custom-datetime');

const confirm = () => {
  datetime.confirm();
};

const reset = () => {
  datetime.reset();
};

const formatDate = (value: string) => {
  return format(parseISO(value), 'MMM dd yyyy');
};

const isDateEnabled = (dateIsoString: string) => {
  const date = new Date(dateIsoString);
  if (getDate(date) === 1 && getMonth(date) === 0 && getYear(date) === 2022) {
    // Disables January 1, 2022.
    return false;
  }
  return true;
};

const disabledDateDatetime = document.querySelector('#disabled-date-datetime');
disabledDateDatetime.isDateEnabled = isDateEnabled;

const popoverDatetime = document.querySelector('#popover-datetime');
const dateInput = document.querySelector('#date-input');
popoverDatetime.addEventListener('ionChange', ev => dateInput.innerText = formatDate(ev.detail.value));

const popoverDatetime2 = document.querySelector('#popover-datetime-2');
const dateInput2 = document.querySelector('#date-input-2');
popoverDatetime2.addEventListener('ionChange', ev => dateInput2.value = formatDate(ev.detail.value));
```