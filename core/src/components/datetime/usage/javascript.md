```html
<ion-item>
  <ion-label>MMMM</ion-label>
  <ion-datetime display-format="MMMM" value="2012-12-15T13:47:20.789"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>MM DD YY</ion-label>
  <ion-datetime display-format="MM DD YY" placeholder="Select Date"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>Disabled</ion-label>
  <ion-datetime id="dynamicDisabled" display-format="MM DD YY" disabled value="1994-12-15"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>YYYY</ion-label>
  <ion-datetime id="customPickerOptions" placeholder="Custom Options" display-format="YYYY" min="1981" max="2002"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label position="stacked">MMMM YY</ion-label>
  <ion-datetime display-format="MMMM YY" min="1989-06-04" max="2004-08-23" value="1994-12-15T13:47:20.789"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label position="floating">MM/DD/YYYY</ion-label>
  <ion-datetime display-format="MM/DD/YYYY" min="1994-03-14" max="2012-12-09" value="2002-09-23T15:03:46.789"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label position="floating">MM/DD/YYYY</ion-label>
  <ion-datetime display-format="MM/DD/YYYY" min="1994-03-14" max="2012-12-09"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>DDD. MMM DD, YY (custom locale)</ion-label>
  <ion-datetime id="customDayShortNames" value="1995-04-15" min="1990-02" max="2000"
    display-format="DDD. MMM DD, YY"
    month-short-names="jan, feb, mar, apr, mai, jun, jul, aug, sep, okt, nov, des"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>D MMM YYYY H:mm</ion-label>
  <ion-datetime display-format="D MMM YYYY H:mm" min="1997" max="2010" value="2005-06-17T11:06Z"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>DDDD MMM D, YYYY</ion-label>
  <ion-datetime display-format="DDDD MMM D, YYYY" min="2005" max="2016" value="2008-09-02"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>HH:mm</ion-label>
  <ion-datetime display-format="HH:mm"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>h:mm a</ion-label>
  <ion-datetime display-format="h:mm a"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>hh:mm A (15 min steps)</ion-label>
  <ion-datetime display-format="h:mm A" minute-values="0,15,30,45"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>Leap years, summer months</ion-label>
  <ion-datetime id="customYearValues" display-format="MM/YYYY" picker-format="MMMM YYYY" month-values="6,7,8"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>Specific days/months/years</ion-label>
  <ion-datetime month-values="6,7,8" year-values="2014,2015" day-values="01,02,03,04,05,06,08,09,10, 11, 12, 13, 14" display-format="DD/MMM/YYYY"></ion-datetime>
</ion-item>

<ion-item>
  <ion-label>Default picker date without setting ion-datetime value</ion-label>
  <ion-datetime default-picker-value="1995-04-05T00:00:00Z"></ion-datetime>
</ion-item>
```

```javascript
var yearValuesArray = [2020, 2016, 2008, 2004, 2000, 1996];
var customYearValues = document.getElementById('customYearValues');
customYearValues.yearValues = yearValuesArray;

var dayShortNamesArray = [
  's\u00f8n',
  'man',
  'tir',
  'ons',
  'tor',
  'fre',
  'l\u00f8r'
];
var customDayShortNames = document.getElementById('customDayShortNames');
customDayShortNames.dayShortNames = dayShortNamesArray;

var customPickerButtons = {
  buttons: [{
    text: 'Save',
    handler: () => console.log('Clicked Save!')
  }, {
    text: 'Log',
    handler: () => {
      console.log('Clicked Log. Do not Dismiss.');
      return false;
    }
  }]
}
var customPickerOptions = document.getElementById('customPickerOptions');
customPickerOptions.pickerOptions = customPickerButtons;
```