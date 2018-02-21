import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { ConferenceData } from '../providers/conference-data';

@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html'
})
export class ScheduleFilterPage {
  tracks: Array<{name: string, isChecked: boolean}> = [];

  constructor(
    public confData: ConferenceData,
    public modalController: ModalController,
    public navParams: NavParams,
  ) {
  }

  ngAfterViewInit() {
    const excludedTrackNames = this.navParams.data.excludedTracks;
    this.confData.getTracks().subscribe((trackNames: string[]) => {

      trackNames.forEach(trackName => {
        this.tracks.push({
          name: trackName,
          isChecked: (excludedTrackNames.indexOf(trackName) === -1)
        });
      });
      console.log('this.tracks: ', this.tracks);

    });
  }

  resetFilters() {
    // reset all of the toggles to be checked
    this.tracks.forEach(track => {
      track.isChecked = true;
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    const excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTrackNames);
  }

  dismiss(data?: any) {
    this.modalController.dismiss(data);
  }
}
