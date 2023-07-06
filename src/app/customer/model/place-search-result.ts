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
 
export class RequestVendorModel {
    currentLocation: AddressModel;
    currentStageId: number = 0;
    distanceKM: number = 0;
    dropOffLocation: AddressModel;
    durationInMins: string;
    expireDateTime: Date;
    pickupLocation: AddressModel;
    UserId: number;
    requestNumber:string;
    requestId : number;
    vendorDetails: RequestVendorDetailsModel[];
}

export class AddressModel {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
}

export class RequestVendorDetailsModel {
    vendorId: number;
    firstName : string;
    lastName : string;
    contactNo : string;
    totalAmount : number;
    latitude :number;
    longitude : number;
    durationInMins : string;
    distanceKM : number;
    isCustomerAccepted : boolean;
    isRejectedByVendor : boolean;
    vehicleNumber : string;
    quoationDetailId : number;
}


export class RequestPostViewModel {
    customerId: number;
    quoationDetailedId: number;
}

export class RequestRejectViewModel {
    customerId: number;
    requestId: number;
}

export class TrackServiceModel {
    RequestId: number;
    stageId : string;
    stageName : string;
    dateString : string;
    timeString : string; 
}

export class PastHistoryModel { 
    pastStageId: number = 0;
    requestNumber: string; 
    message:string; 
}