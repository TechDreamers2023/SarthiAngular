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
export class ProfileService {

    constructor(private http: HttpClient) { }

    public getUserProfileById(id: any): Observable<any> {
        return this.http.get<any>(environment.devurl + "/api/Common/GetUserProfileById?userId=" + id, { 'headers': headers });
    }
 
    public updateUserProfile(data: any): Observable<any> {
        return this.http.post<any>(environment.devurl + "/api/Common/UpdateUserProfile", data, { 'headers': headers });
    }
 
}
