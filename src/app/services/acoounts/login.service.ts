import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

//const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
 
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
     ) { }
  public getUser(data:any): Observable<any> 
  {
    return this.http.post<any>(environment.devurl+"/api/Common/UserAuthentication",data,{'headers':headers});
  }
}
