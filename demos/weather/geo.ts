export class Geo {
  static reverseGeocode(lat, lng) {
    return new Promise((resolve, reject) => {

      let geocoder = new google.maps.Geocoder();

      geocoder.geocode({
        'latLng': new google.maps.LatLng(lat, lng)
      }, (results, status) => {

        if (status == google.maps.GeocoderStatus.OK) {

          console.log('Reverse', results);

          if(results.length > 1) {
            var r = results[1];
            var a, types;
            var parts = [];
            var foundLocality = false;
            var foundState = false;

            for(var i = 0; i < r.address_components.length; i++) {
              a = r.address_components[i];
              types = a.types;
              for(var j = 0; j < types.length; j++) {
                if(!foundLocality && types[j] == 'locality') {
                  foundLocality = true;
                  parts.push(a.long_name);
                } else if(!foundState && types[j] == 'administrative_area_level_1') {
                  foundState = true;
                  parts.push(a.short_name);
                }
              }
            }

            console.log('Reverse', parts);
            resolve(parts.join(', '));
          }
        } else {
          console.log('reverse fail', results, status);
          reject(results);
        }
      });
    });
  }

  static getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      }, (error) => {
        reject(error);
      })
    });
  }
}
