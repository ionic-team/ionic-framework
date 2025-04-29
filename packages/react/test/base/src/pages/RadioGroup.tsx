import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonPage, IonRadio, IonRadioGroup, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';

interface RadioGroupProps {

}

export interface Item {
  text: string;
  value: string;
}

const items: Item[] = [
  { text: 'Apple', value: 'apple' },
  { text: 'Apricot', value: 'apricot' },
  { text: 'Banana', value: 'banana' },
  { text: 'Blackberry', value: 'blackberry' },
  { text: 'Blueberry', value: 'blueberry' },
  { text: 'Cherry', value: 'cherry' },
  { text: 'Cranberry', value: 'cranberry' },
  { text: 'Grape', value: 'grape' },
  { text: 'Grapefruit', value: 'grapefruit' },
  { text: 'Guava', value: 'guava' },
];

const RadioGroup: React.FC<RadioGroupProps> = () => {
  const [filteredItems, setFilteredItems] = useState<Item[]>([...items]);

  const searchbarInput = (event: any) => {
    filterList(event.target.value);
  };

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  const filterList = (searchQuery: string | null | undefined) => {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined || searchQuery === null) {
      setFilteredItems([...items]);
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter((item) => {
          return item.text.toLowerCase().includes(normalizedQuery);
        })
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Radio Group</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar onIonInput={searchbarInput}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList inset={true}>
          <IonRadioGroup>
            {filteredItems.map((item) => (
              <IonItem key={item.value}>
                <IonRadio value={item.value}>{item.text}</IonRadio>
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default RadioGroup;
