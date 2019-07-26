```tsx
import React from 'react';
import { IonItem, IonLabel, IonDatetime, IonContent } from '@ionic/react';

const customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];

const customDayShortNames = [
  's\u00f8n',
  'man',
  'tir',
  'ons',
  'tor',
  'fre',
  'l\u00f8r'
];

export const DateTimeExample: React.FunctionComponent = () => (
  <IonContent>
    <IonItem>
      <IonLabel>MMMM</IonLabel>
      <IonDatetime displayFormat="MMMM" value="2012-12-15T13:47:20.789"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>MM DD YY</IonLabel>
      <IonDatetime displayFormat="MM DD YY" placeholder="Select Date"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>Disabled</IonLabel>
      <IonDatetime id="dynamicDisabled" displayFormat="MM DD YY" disabled value="1994-12-15"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>YYYY</IonLabel>
      <IonDatetime pickerOptions={{
          buttons: [
            {
              text: 'Save',
              handler: () => console.log('Clicked Save!')
            }, {
              text: 'Log',
              handler: () => {
                console.log('Clicked Log. Do not Dismiss.');
                return false;
              }
            }
          ]
        }}
        placeholder="Custom Options" displayFormat="YYYY" min="1981" max="2002"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel position="stacked">MMMM YY</IonLabel>
      <IonDatetime displayFormat="MMMM YY" min="1989-06-04" max="2004-08-23" value="1994-12-15T13:47:20.789"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel position="floating">MM/DD/YYYY</IonLabel>
      <IonDatetime displayFormat="MM/DD/YYYY" min="1994-03-14" max="2012-12-09" value="2002-09-23T15:03:46.789"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel position="floating">MM/DD/YYYY</IonLabel>
      <IonDatetime displayFormat="MM/DD/YYYY" min="1994-03-14" max="2012-12-09"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>DDD. MMM DD, YY (custom locale)</IonLabel>
      <IonDatetime
        value="1995-04-15"
        min="1990-02"
        max="2000"
        dayShortNames={customDayShortNames}
        displayFormat="DDD. MMM DD, YY"
        monthShortNames="jan, feb, mar, apr, mai, jun, jul, aug, sep, okt, nov, des"
      ></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>D MMM YYYY H:mm</IonLabel>
      <IonDatetime displayFormat="D MMM YYYY H:mm" min="1997" max="2010" value="2005-06-17T11:06Z"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>DDDD MMM D, YYYY</IonLabel>
      <IonDatetime displayFormat="DDDD MMM D, YYYY" min="2005" max="2016" value="2008-09-02"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>HH:mm</IonLabel>
      <IonDatetime displayFormat="HH:mm"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>h:mm a</IonLabel>
      <IonDatetime displayFormat="h:mm a"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>hh:mm A (15 min steps)</IonLabel>
      <IonDatetime displayFormat="h:mm A" minuteValues="0,15,30,45"></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>Leap years, summer months</IonLabel>
      <IonDatetime displayFormat="MM/YYYY" pickerFormat="MMMM YYYY" monthValues="6,7,8" yearValues={customYearValues}></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel>Specific days/months/years</IonLabel>
      <IonDatetime
        monthValues='6,7,8'
        yearValues='2014,2015'
        dayValues="01,02,03,04,05,06,08,09,10, 11, 12, 13, 14"
        displayFormat="DD/MMM/YYYY"
      ></IonDatetime>
    </IonItem>
  </IonContent>
);
```