export interface PlaceSearchResult {
    location?: google.maps.LatLng;
    address: string;
}

export class RequestViewModel {
    currentlat: number;
    currentlong: number;
    pickuplat: number;
    pickuplong: number;
    dropOfflat: number;
    dropOfflong: number;
    userId: number;
}