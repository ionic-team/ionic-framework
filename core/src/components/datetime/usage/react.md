```javascript
import React, { useState, useRef } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonInput,
  IonItem,
  IonModal,
  IonPage,
  IonPopover
} from '@ionic/react';
import { calendar } from 'ionicons/icons';
import { format, parseISO } from 'date-fns';

export const DateTimeExamples: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2012-12-15T13:47:20.789');
  const [popoverDate, setPopoverDate] = useState('');
  const [popoverDate2, setPopoverDate2] = useState('');

  const customDatetime = useRef();
  const confirm = () => {
    if (customDatetime === undefined) return;
    
    customDatetime.confirm();
  };
  
  const reset = () => {
    if (customDatetime === undefined) return;
    
    customDatetime.reset();
  };

  const formatDate = (value: string) => {
    return format(parseISO(value), 'MMM dd yyyy');
  };

  return (
    <IonPage>
      {/* Initial value */}
      <IonDatetime value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)}></IonDatetime>
      
      {/* Readonly */}
      <IonDatetime readonly></IonDatetime>
      
      {/* Disabled */}
      <IonDatetime disabled></IonDatetime>
      
      {/* Custom locale */}
      <IonDatetime locale="en-GB"></IonDatetime>
      
      {/* Max and min */}
      <IonDatetime min="1994-03-14" max="2012-12-09" value="2008-09-02"></IonDatetime>
      
      {/* 15 minute increments */}
      <IonDatetime minuteValues="0,15,30,45"></IonDatetime>
      
      {/* Specific days/months/years */} 
      <IonDatetime monthValues="6,7,8" yearValues="2014,2015" dayValues="01,02,03,04,05,06,08,09,10,11,12,13,14"></IonDatetime>
      
      {/* Selecting time, no date */}
      <IonDatetime presentation="time"></IonDatetime>
      
      {/* Selecting time first, date second */}
      <IonDatetime presentation="time-date"></IonDatetime>

      {/* Full width size */}
      <IonDatetime size="cover"></IonDatetime>
      
      {/* Custom Hour Cycle */}
      <IonDatetime hourCycle="h23"></IonDatetime>
      
      {/* Custom first day of week */}
      <IonDatetime firstDayOfWeek={1}></IonDatetime>

      {/* Custom title */}
      <IonDatetime>
        <div slot="title">My Custom Title</div>
      </IonDatetime>

      {/* Clear button */}
      <IonDatetime showClearButton={true}></IonDatetime>
      
      {/* Custom buttons */}
      <IonDatetime ref={customDatetime}>
        <IonButtons slot="buttons">
          <IonButton onClick={() => confirm()}>Good to go!</IonButton>
          <IonButton onClick={() => reset()}>Reset</IonButton>
        </IonButtons>
      </IonDatetime>
      
      {/* Datetime in overlay */}
      <IonButton id="open-modal">Open Datetime Modal</IonButton>
      <IonModal trigger="open-modal">
        <IonContent>
          <IonDatetime></IonDatetime>
        </IonContent>
      </IonModal>

      {/* Datetime in popover with cover element */}
      <IonItem button={true} id="open-date-input">
        <IonLabel>Date</IonLabel>
        <IonText slot="end">{popoverDate}</IonText>
        <IonPopover trigger="open-date-input" showBackdrop={false}>
          <IonDatetime
            presentation="date"
            onIonChange={ev => setPopoverDate(formatDate(ev.detail.value!))}
          />
        </IonPopover>
      </IonItem>

      {/* Datetime in popover with input */}
      <IonItem>
        <IonInput id="date-input-2" value={popoverDate2} />
        <IonButton fill="clear" id="open-date-input-2">
          <IonIcon icon={calendar} />
        </IonButton>
        <IonPopover trigger="open-date-input-2" showBackdrop={false}>
          <IonDatetime
            presentation="date"
            onIonChange={ev => setPopoverDate2(formatDate(ev.detail.value!))}
          />
        </IonPopover>
      </IonItem>
    </IonPage>
  )
}
```