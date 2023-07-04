import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class RegisterClientService {

  constructor( private http: HttpClient) { }

  // set api with observables

  public registerClients(data:any): Observable<any> 
  {
    return this.http.post<any>(environment.devurl+"/api/Common/UserRegistration",data,{'headers':headers});
  }
}
