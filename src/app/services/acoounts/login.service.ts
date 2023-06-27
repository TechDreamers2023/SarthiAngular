import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient ) { }
  public getEmployees(): Observable<any> 
  {
    const url = 'http://localhost:3000/employees';
    return this.http.get<any>(url);
  }
}
