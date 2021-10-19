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

<!-- Datetime in overlay -->
<ion-button id="open-modal">Open Datetime Modal</ion-button>
<ion-modal trigger="open-modal">
  <ion-content>
    <ion-datetime></ion-datetime>
  </ion-content>
</ion-modal>

<!-- Datetime in popover with input -->
<ion-input type="date" id="date-input"></ion-input>
<ion-popover trigger="date-input" show-backdrop="false">
  <ion-datetime presentation="date" id="popover-datetime"></ion-datetime>
</ion-popover>

<!-- Datetime in popover with input; button trigger -->
<ion-item>
  <ion-input type="date" id="date-input-2"></ion-input>
  <ion-button slot="end" fill="clear" id="open-date-input-2">
    <ion-icon icon="calendar"></ion-icon>
  </ion-button>
  <ion-popover trigger="open-date-input-2" show-backdrop="false">
    <ion-datetime presentation="date" id="popover-datetime-2"></ion-datetime>
  </ion-popover>
</ion-item>
```

```javascript
const datetime = document.querySelector('#custom-datetime');

const confirm = () => {
  datetime.confirm();
};

const reset = () => {
  datetime.reset();
};

const updateValue = (input, newValue) => {
  input.value = newValue.split('T')[0];
};

const popoverDatetime = document.querySelector('#popover-datetime');
const dateInput = document.querySelector('#date-input');
popoverDatetime.addEventListener('ionChange', ev => updateValue(dateInput, ev.detail.value));

const popoverDatetime2 = document.querySelector('#popover-datetime-2');
const dateInput2 = document.querySelector('#date-input-2');
popoverDatetime2.addEventListener('ionChange', ev => updateValue(dateInput2, ev.detail.value));
```

```css
/* hide native calendar button */
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
```