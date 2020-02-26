import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { Login } from '../classes/Login';
import { Observable } from 'rxjs';
import { User } from '../classes/User';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private httpClient: HttpClient) { }

  getTheToken(loginUser : Login) : Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.append('Content-type','application/x-www-form-urlencoded');

    return this.httpClient.post('http://localhost:52295/oauth/token', 'username='+loginUser.UserName+'&password='+loginUser.Password+'&grant_type=password',{"headers": headers});

  }

  RegistrationGuest(guest:User):Observable<any>
  {
    return this.httpClient.post("http://localhost:52295/api/Account/Register",guest);
  }

  logOut() : any{
    return this.httpClient.post("http://localhost:52295/api/Account/Logout", httpOptions);
  }
}
