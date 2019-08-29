import { Location as HistoryLocation } from 'history';

const RESTRICT_SIZE = 25;

export class LocationHistory {
  locationHistory: HistoryLocation[] = [];

  add(location: HistoryLocation) {
    this.locationHistory.push(location);
    if(this.locationHistory.length > RESTRICT_SIZE) {
      this.locationHistory.splice(0, 10);
    }
  }

  findLastLocation(url: string) {
    const reversedLocations = [...this.locationHistory].reverse();
    const last = reversedLocations.find(x => x.pathname.toLowerCase() === url.toLowerCase());
    return last;
  }
}
