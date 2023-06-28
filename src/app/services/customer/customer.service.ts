import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

 const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
 
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient
     ) { }

  public GetCurrentStatusByCustomer(customerId:number): Observable<any> 
  {
    return this.http.get<any>(environment.devurl+"/api/Request/GetCurrentStatusByCustomer?customerId="+customerId);
  }
}
