```html
<template>
  <ion-item>
    <ion-label>MMMM</ion-label>
    <ion-datetime displayFormat="MMMM" value="2012-12-15T13:47:20.789"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>MM DD YY</ion-label>
    <ion-datetime displayFormat="MM DD YY" placeholder="Select Date"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>Disabled</ion-label>
    <ion-datetime id="dynamicDisabled" displayFormat="MM DD YY" disabled value="1994-12-15"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>YYYY</ion-label>
    <ion-datetime :pickerOptions="customPickerOptions" placeholder="Custom Options" displayFormat="YYYY" min="1981" max="2002"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">MMMM YY</ion-label>
    <ion-datetime displayFormat="MMMM YY" min="1989-06-04" max="2004-08-23" value="1994-12-15T13:47:20.789"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label position="floating">MM/DD/YYYY</ion-label>
    <ion-datetime displayFormat="MM/DD/YYYY" min="1994-03-14" max="2012-12-09" value="2002-09-23T15:03:46.789"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label position="floating">MM/DD/YYYY</ion-label>
    <ion-datetime displayFormat="MM/DD/YYYY" min="1994-03-14" max="2012-12-09"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>DDD. MMM DD, YY (custom locale)</ion-label>
    <ion-datetime value="1995-04-15" min="1990-02" max="2000"
      :dayShortNames="customDayShortNames"
      displayFormat="DDD. MMM DD, YY"
      monthShortNames="jan, feb, mar, apr, mai, jun, jul, aug, sep, okt, nov, des"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>D MMM YYYY H:mm</ion-label>
    <ion-datetime displayFormat="D MMM YYYY H:mm" min="1997" max="2010" value="2005-06-17T11:06Z"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>DDDD MMM D, YYYY</ion-label>
    <ion-datetime displayFormat="DDDD MMM D, YYYY" min="2005" max="2016" value="2008-09-02"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>HH:mm</ion-label>
    <ion-datetime displayFormat="HH:mm"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>h:mm a</ion-label>
    <ion-datetime displayFormat="h:mm a"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>hh:mm A (15 min steps)</ion-label>
    <ion-datetime displayFormat="h:mm A" minuteValues="0,15,30,45"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>Leap years, summer months</ion-label>
    <ion-datetime displayFormat="MM/YYYY" pickerFormat="MMMM YYYY" monthValues="6,7,8" :yearValues="customYearValues"></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label>Specific days/months/years</ion-label>
    <ion-datetime monthValues="6,7,8" yearValues="2014,2015" dayValues="01,02,03,04,05,06,08,09,10, 11, 12, 13, 14" displayFormat="DD/MMM/YYYY"></ion-datetime>
  </ion-item>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];

    customDayShortNames = [
      's\u00f8n',
      'man',
      'tir',
      'ons',
      'tor',
      'fre',
      'l\u00f8r'
    ];

    customPickerOptions = {
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
  }
</script>
```