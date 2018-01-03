import { Component, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapPage {

  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(public confData: ConferenceData) {
  }

  ionViewDidEnter() {
      this.confData.getMap().subscribe((mapData: any) => {
        const mapEle = this.mapElement.nativeElement;

        return this.getGoogle().then(() => {
          const map = new google.maps.Map(mapEle, {
            center: mapData.find((d: any) => d.center),
            zoom: 16
          });

          mapData.forEach((markerData: any) => {
            const infoWindow = new google.maps.InfoWindow({
              content: `<h5>${markerData.name}</h5>`
            });

            const marker = new google.maps.Marker({
              position: markerData,
              map: map,
              title: markerData.name
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          });

          google.maps.event.addListenerOnce(map, 'idle', () => {
            mapEle.classList.add('show-map');
          });
        });
      });
  }

  getGoogle() {
    function checkForGoogle(callback: Function) {
      setTimeout(() => {
        if (google) {
          return callback(callback);
        }

        checkForGoogle(callback);

      }, 50);
    }

    return new Promise((resolve) => {
      checkForGoogle(resolve);
    });
  }
}
