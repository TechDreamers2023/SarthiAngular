export interface PlaceSearchResult {
    location?: google.maps.LatLng;
    address: string;
}

export interface ProfileForm {
    firstName: string;
    password: string;
    confirm_password: string;
  }