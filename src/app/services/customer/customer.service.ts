import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestPostViewModel, RequestViewModel } from 'src/app/customer/model/place-search-result';

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  constructor(
    private http: HttpClient) {
  }

  public GetCurrentStatusByCustomer(customerId: number): Observable<any> {
    return this.http.get<any>(environment.devurl + "/api/Request/GetCurrentStatusByCustomer?customerId=" + customerId);
  }
  public GenerateServiceRequest(requestViewModel: RequestViewModel): Observable<any> {
    return this.http.post<any>(environment.devurl + "/api/Request/GenerateServiceRequest", requestViewModel, { 'headers': headers });
  }

  public GetAllQuotationRequest(customerId: number): Observable<any> {
    return this.http.get<any>(environment.devurl + "/api/Request/GetAllQuotationRequest?customerId=" + customerId);
  }

  public AcceptQuotationByCustomer(requestPostViewModel : RequestPostViewModel): Observable<any> {
    console.log(requestPostViewModel);
    return this.http.post<any>(environment.devurl + "/api/Request/AcceptQuotationByCustomer",requestPostViewModel, { 'headers': headers });
  }

  public GetActiveCustomerRequest(customerId: number): Observable<any> {
    return this.http.get<any>(environment.devurl + "/api/Request/GetCustomerServiceRequest?customerId=" + customerId);
  }
  public GetTrackServiceRequest(customerId: number): Observable<any> {
    return this.http.get<any>(environment.devurl + "/api/Common/GetTrackServiceRequest?userId=" + customerId);
  }

  public GetPastTrackServiceRequest(customerId: number): Observable<any> {
    return this.http.get<any>(environment.devurl + "/api/Common/GetPastHistoyDeatilsCustomer?userId=" + customerId);
  }
}
