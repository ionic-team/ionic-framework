import { Location as HistoryLocation } from 'history';

const RESTRICT_SIZE = 25;

export class LocationHistory {
  private locationHistory: HistoryLocation[] = [];

  add(location: HistoryLocation) {
    this.locationHistory.push(location);
    if (this.locationHistory.length > RESTRICT_SIZE) {
      this.locationHistory.splice(0, 10);
    }
  }

  pop() {
    this.locationHistory.pop();
  }

  replace(location: HistoryLocation) {
    this.locationHistory.pop();
    this.locationHistory.push(location);
  }

  clear() {
    this.locationHistory = [];
  }

  findLastLocationByUrl(url: string) {
    for (let i = this.locationHistory.length - 1; i >= 0; i--) {
      const location = this.locationHistory[i];
      if (location.pathname.toLocaleLowerCase() === url.toLocaleLowerCase()) {
        return location;
      }
    }
    return undefined;
  }

  previous() {
    return this.locationHistory[this.locationHistory.length - 2];
  }

  current() {
    return this.locationHistory[this.locationHistory.length - 1];
  }
}
