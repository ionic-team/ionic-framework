# ion-checkbox


Placed in an `ion-item` or used as a stand-alone checkbox.


```html

 <ion-list>

   <ion-item>
     <ion-label>Pepperoni</ion-label>
     <ion-checkbox [(ngModel)]="pepperoni"></ion-checkbox>
   </ion-item>

   <ion-item>
     <ion-label>Sausage</ion-label>
     <ion-checkbox [(ngModel)]="sausage" disabled="true"></ion-checkbox>
   </ion-item>

   <ion-item>
     <ion-label>Mushrooms</ion-label>
     <ion-checkbox [(ngModel)]="mushrooms"></ion-checkbox>
   </ion-item>

 </ion-list>
```

@advanced

```html

<!-- Call function when state changes -->
 <ion-list>

   <ion-item>
     <ion-label>Cucumber</ion-label>
     <ion-checkbox [(ngModel)]="cucumber" (ionChange)="updateCucumber()"></ion-checkbox>
   </ion-item>

 </ion-list>
```

```ts
@Component({
  templateUrl: 'main.html'
})
class SaladPage {
  cucumber: boolean;

  updateCucumber() {
    console.log('Cucumbers new state:' + this.cucumber);
  }
}
```


<!-- Auto Generated Below -->


## Properties

#### checked

boolean


#### color

string


#### disabled

boolean


#### mode

any


#### value

string


## Attributes

#### checked

boolean


#### color

string


#### disabled

boolean


#### mode

any


#### value

string


## Events

#### ionBlur


#### ionChange


#### ionFocus


#### ionStyle



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
