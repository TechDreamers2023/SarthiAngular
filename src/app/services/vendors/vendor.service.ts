import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

//const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

@Injectable({
    providedIn: 'root'
})
export class VendorService {

    constructor(private http: HttpClient) { }

    public manageShift(): Observable<any> {
        return this.http.get<any>(environment.devurl + "/api/Vendor/ManageVendorShifts?vendorId=" + localStorage.getItem("UserID"), { 'headers': headers });
    }
    
    public getShiftStatus(): Observable<any> {
        return this.http.get<any>(environment.devurl + "/api/Vendor/CheckVendorShiftStatus?vendorId=" + localStorage.getItem("UserID"), { 'headers': headers });
    }

    public saveVendorLocation(data: any): Observable<any> {
        return this.http.post<any>(environment.devurl + "/api/Vendor/SaveVendorLocations", data, { 'headers': headers });
    }
}
