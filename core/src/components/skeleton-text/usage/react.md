```tsx
import React, { useState } from 'react';
import {
  IonContent,
  IonItem,
  IonAvatar,
  IonLabel,
  IonSkeletonText,
  IonListHeader,
  IonIcon,
  IonThumbnail,
  IonList
} from '@ionic/react';
import './SkeletonTextExample.css';

export const SkeletonTextExample: React.FunctionComponent = () => {
  const [data, setData] = useState();

  setTimeout(() => {
    setData({
      heading: 'Normal text',
      para1: 'Lorem ipsum dolor sit amet, consectetur',
      para2: 'adipiscing elit.'
    });
  }, 5000);

  return (
    <IonContent>
      {data ? (
        <>
          <div className="ion-padding">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac eros est. Cras iaculis pulvinar
            arcu non vehicula. Fusce at quam a eros malesuada condimentum. Aliquam tincidunt tincidunt
            vehicula.
          </div>

          <IonList>
            <IonListHeader>Data</IonListHeader>
            <IonItem>
              <IonAvatar slot="start">
                <img src="./avatar.svg" />
              </IonAvatar>
              <IonLabel>
                <h3>{data.heading}</h3>
                <p>{data.para1}</p>
                <p>{data.para2}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonThumbnail slot="start">
                <img src="./thumbnail.svg" />
              </IonThumbnail>
              <IonLabel>
                <h3>{data.heading}</h3>
                <p>{data.para1}</p>
                <p>{data.para2}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon name="call" slot="start" />
              <IonLabel>
                <h3>{data.heading}</h3>
                <p>{data.para1}</p>
                <p>{data.para2}</p>
              </IonLabel>
            </IonItem>
          </IonList>
        </>
      ) : (
        <>
          <div className="ion-padding custom-skeleton">
            <IonSkeletonText animated style={{ width: '60%' }} />
            <IonSkeletonText animated />
            <IonSkeletonText animated style={{ width: '88%' }} />
            <IonSkeletonText animated style={{ width: '70%' }} />
            <IonSkeletonText animated style={{ width: '60%' }} />
          </div>

          <IonList>
            <IonListHeader>
              <IonSkeletonText animated style={{ width: '20%' }} />
            </IonListHeader>
            <IonItem>
              <IonAvatar slot="start">
                <IonSkeletonText animated />
              </IonAvatar>
              <IonLabel>
                <h3>
                  <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                  <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
                <p>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonThumbnail slot="start">
                <IonSkeletonText animated />
              </IonThumbnail>
              <IonLabel>
                <h3>
                  <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                  <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
                <p>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonSkeletonText animated style={{ width: '27px', height: '27px' }} slot="start" />
              <IonLabel>
                <h3>
                  <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                  <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
                <p>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                </p>
              </IonLabel>
            </IonItem>
          </IonList>
        </>
      )}
    </IonContent>
  );
};
```

```css
/* Custom Skeleton Line Height and Margin */
.custom-skeleton ion-skeleton-text {
  line-height: 13px;
}

.custom-skeleton ion-skeleton-text:last-child {
  margin-bottom: 5px;
}
```