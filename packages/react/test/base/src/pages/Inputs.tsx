import React, { useState } from 'react';

import type {
  IonDatetimeCustomEvent,
  DatetimeChangeEventDetail,
  IonTextareaCustomEvent,
  TextareaInputEventDetail,
  IonSelectCustomEvent,
  SelectChangeEventDetail,
  IonRadioGroupCustomEvent,
  RadioGroupChangeEventDetail,
  IonCheckboxCustomEvent,
  CheckboxChangeEventDetail,
  IonToggleCustomEvent,
  ToggleChangeEventDetail,
  IonRangeCustomEvent,
  RangeChangeEventDetail,
  IonSegmentCustomEvent,
  SegmentChangeEventDetail,
  IonInputCustomEvent,
  InputInputEventDetail,
  IonSearchbarCustomEvent,
  SearchbarInputEventDetail,
  IonInputOtpCustomEvent,
  InputOtpInputEventDetail,
} from '@ionic/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonInputOtp,
  IonItem,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/react';

interface InputsProps {}

const Inputs: React.FC<InputsProps> = () => {
  const [checkbox, setCheckbox] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [input, setInput] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [range, setRange] = useState({ lower: 30, upper: 70 });
  const [textarea, setTextarea] = useState('');
  const [searchbar, setSearchbar] = useState('');
  const [datetime, setDatetime] = useState('');
  const [radio, setRadio] = useState('red');
  const [segment, setSegment] = useState('dogs');
  const [select, setSelect] = useState('apples');

  const [touched, setTouched] = useState({
    input: false,
    inputOtp: false,
    textarea: false,
  });

  const getValidationClasses = (fieldName: keyof typeof touched, value: string | number | null | undefined) => {
    const isTouched = touched[fieldName];
    let isValid = false;

    // Handle ion-input-otp which has multiple inputs
    if (fieldName === 'inputOtp') {
      // input-otp needs to check if all inputs are filled
      // (value length equals component length)
      const valueStr = String(value || '');
      isValid = valueStr.length === 4;
    } else {
      const isEmpty = value === '' || value === null || value === undefined;
      isValid = !isEmpty;
    }

    // Always return validation classes
    // ion-touched is only added on blur
    const classes: string[] = [];
    if (isTouched) {
      classes.push('ion-touched');
    }
    if (isValid) {
      classes.push('ion-valid');
    } else {
      classes.push('ion-invalid');
    }
    return classes.join(' ');
  };

  const reset = () => {
    setCheckbox(false);
    setToggle(false);
    setInput('');
    setInputOtp('');
    setRange({ lower: 30, upper: 70 });
    setTextarea('');
    setSearchbar('');
    setDatetime('');
    setRadio('red');
    setSegment('dogs');
    setSelect('apples');
    setTouched({
      input: false,
      inputOtp: false,
      textarea: false,
    });
  };

  const set = () => {
    setCheckbox(true);
    setToggle(true);
    setInput('Hello World');
    setInputOtp('1234');
    setRange({ lower: 10, upper: 90 });
    setTextarea('Lorem Ipsum');
    setSearchbar('Search Query');
    setDatetime('2019-01-31');
    setRadio('blue');
    setSegment('cats');
    setSelect('bananas');
  };

  return (
    <IonPage data-pageid="inputs">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Inputs</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(e: IonSegmentCustomEvent<SegmentChangeEventDetail>) => {
              if (typeof e.detail.value === 'string') setSegment(e.detail.value);
            }}
          >
            <IonSegmentButton value="dogs">
              <IonLabel>Dogs</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="cats">
              <IonLabel>Cats</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchbar}
            onIonInput={(e: IonSearchbarCustomEvent<SearchbarInputEventDetail>) => setSearchbar(e.detail.value!)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inputs</IonTitle>
          </IonToolbar>
        </IonHeader>

        <form>
          <IonItem>
            <IonCheckbox
              checked={checkbox}
              onIonChange={(e: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) => setCheckbox(e.detail.checked)}
            >
              Checkbox
            </IonCheckbox>
          </IonItem>

          <IonItem>
            <IonToggle
              checked={toggle}
              onIonChange={(e: IonToggleCustomEvent<ToggleChangeEventDetail>) => setToggle(e.detail.checked)}
            >
              Toggle
            </IonToggle>
          </IonItem>

          <IonItem>
            <IonInput
              value={input}
              onIonInput={(e: IonInputCustomEvent<InputInputEventDetail>) => setInput(e.detail.value!)}
              onIonBlur={() => setTouched(prev => ({ ...prev, input: true }))}
              className={getValidationClasses('input', input)}
              label="Input"
              required
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonInputOtp
              value={inputOtp}
              onIonInput={(e: IonInputOtpCustomEvent<InputOtpInputEventDetail>) => setInputOtp(e.detail.value ?? '')}
              onIonBlur={() => setTouched(prev => ({ ...prev, inputOtp: true }))}
              className={getValidationClasses('inputOtp', inputOtp)}
              required
            ></IonInputOtp>
          </IonItem>

          <IonItem>
            <IonRange
              label="Range"
              dualKnobs={true}
              min={0}
              max={100}
              value={range}
              onIonChange={(e: IonRangeCustomEvent<RangeChangeEventDetail>) => setRange(e.detail.value as { lower: number; upper: number })}
            ></IonRange>
          </IonItem>

          <IonItem>
            <IonTextarea
              value={textarea}
              onIonInput={(e: IonTextareaCustomEvent<TextareaInputEventDetail>) => setTextarea(e.detail.value!)}
              onIonBlur={() => setTouched(prev => ({ ...prev, textarea: true }))}
              className={getValidationClasses('textarea', textarea)}
              label="Textarea"
              required
            ></IonTextarea>
          </IonItem>

          <IonItem>
            <IonLabel>Datetime</IonLabel>
            <IonDatetime
              value={datetime}
              onIonChange={(e: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) => {
                const value = e.detail.value;
                if (typeof value === 'string') {
                  setDatetime(value);
                }
              }}
            ></IonDatetime>
          </IonItem>

          <IonRadioGroup
            value={radio}
            onIonChange={(e: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail>) => setRadio(e.detail.value)}
          >
            <IonItem>
              <IonRadio value="red">Red</IonRadio>
            </IonItem>
            <IonItem>
              <IonRadio value="green">Green</IonRadio>
            </IonItem>
            <IonItem>
              <IonRadio value="blue">Blue</IonRadio>
            </IonItem>
          </IonRadioGroup>

          <IonItem>
            <IonSelect
              value={select}
              onIonChange={(e: IonSelectCustomEvent<SelectChangeEventDetail<any>>) => setSelect(e.detail.value)}
              label="Select"
            >
              <IonSelectOption value="apples">Apples</IonSelectOption>
              <IonSelectOption value="bananas">Bananas</IonSelectOption>
            </IonSelect>
          </IonItem>
        </form>

        <div className="ion-padding">
          Checkbox: {checkbox.toString()}<br />
          Toggle: {toggle.toString()}<br />
          Input: <span id="input-ref">{input}</span><br />
          Input OTP: <span id="input-otp-ref">{inputOtp}</span><br />
          Range: {JSON.stringify(range)}<br />
          Textarea: <span id="textarea-ref">{textarea}</span><br />
          Searchbar: <span id="searchbar-ref">{searchbar}</span><br />
          Datetime: {datetime}<br />
          Radio Group: {radio}<br />
          Segment: {segment}<br />
          Select: {select}<br />

          <br />

          <IonButton expand="block" onClick={reset} id="reset">Reset Values</IonButton>
          <IonButton expand="block" onClick={set} id="set">Set Values</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Inputs;
