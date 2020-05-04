import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { Login } from '../classes/Login';
import { Observable } from 'rxjs';
import { User } from '../classes/User';

import { Station } from '../classes/Station';
import {Line} from '../classes/Line';
import { TimeTable } from '../classes/TimeTable';
import { StationLine } from '../classes/StationLine';
import { PriceList } from '../classes/PriceList';
import { Ticket } from '../classes/Ticket';

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

    return this.httpClient.post('http://localhost:52295/oauth/token', 'username='+loginUser.Username+'&password='+loginUser.Password+'&grant_type=password',{"headers": headers});

  }

  RegistrationGuest(guest:User):Observable<any>
  {
    return this.httpClient.post("http://localhost:52295/api/Account/Register",guest);
  }

  logOut() : any{
    return this.httpClient.post("http://localhost:52295/api/Account/Logout", httpOptions);
  }

  getUser(): any{
    return this.httpClient.get('http://localhost:52295/api/ApplicationUser/0', httpOptions);
  }

  getTicket(id:string): any{
    return this.httpClient.get('http://localhost:52295/api/Ticket',{params:{id}});
  }

  putApplicationUsers(id:string,user:User):Observable<any>
  {
      let header=new HttpHeaders();
      header.append('enctype','multipart/form-data');
      let body=new FormData();
      body.append('user',JSON.stringify(user));

      return this.httpClient.put('http://localhost:52295/api/ApplicationUser/1', body,{'headers' : header} );

  }

  getAllLines():any{
    return this.httpClient.get("http://localhost:52295/api/Line");
  }

  getAllTickets():any{
    return this.httpClient.get("http://localhost:52295/api/Ticket");
  }

  getAllStationLines():any{
    return this.httpClient.get("http://localhost:52295/api/StationLine");
  }

  getAllUsers():any{
    return this.httpClient.get("http://localhost:52295/api/ApplicationUser");
  }

  getAllPriceLists():any{
    return this.httpClient.get("http://localhost:52295/api/PriceList");
  }

  getAllTimetables():any{
    return this.httpClient.get("http://localhost:52295/api/Timetable");
  }

  getTimetablebyLineid(lineId:string):Observable<any>
  {
    return this.httpClient.get<any>("http://localhost:52295/api/Timetables/GetTimetablebyLineId",{params:{lineId}});
  }

  getAllStations():any{
    return this.httpClient.get("http://localhost:52295/api/Station");
  }

  postLine(Line:Line):Observable<any>{
    return this.httpClient.post("http://localhost:52295/api/Line", Line);
  }

  postTicket(t:Ticket):Observable<any>{
    return this.httpClient.post("http://localhost:52295/api/Ticket", t);
  }

  postStation(station:Station):Observable<any>{
    return this.httpClient.post("http://localhost:52295/api/Station", station);
  }
  
  postStationLine(stationLine:StationLine){
    return this.httpClient.post("http://localhost:52295/api/StationLine", stationLine);
  }

  postTimetable(timetable:TimeTable){
    return this.httpClient.post("http://localhost:52295/api/Timetable", timetable);
  }

  postPriceList(pricelist:PriceList){
    return this.httpClient.post("http://localhost:52295/api/PriceList", pricelist);
  }

  putTimeTable(id:string, timeTiable: TimeTable): any{
    return this.httpClient.put(`http://localhost:52295/api/Timetable/${id}`, timeTiable);}


  putLine(LineId : number, line: Line): Observable<any>{
      return this.httpClient.put(`http://localhost:52295/api/Line/${LineId}`, line );
    }

  putPriceList(id:string,pricelist:PriceList): Observable<any>{
    return this.httpClient.put(`http://localhost:52295/api/PriceList/${id}`, pricelist );
  }

  putStation(StationId : number, station: Station): Observable<any>{
      return this.httpClient.put(`http://localhost:52295/api/Station/${StationId}`, station );
    }
  deleteTime(id :string) :any{
      return this.httpClient.delete(`http://localhost:52295/api/Timetable/${id}`);
    }

  deleteStation(id :number) :any{
      return this.httpClient.delete(`http://localhost:52295/api/Station/${id}`);
    }

  deleteLine(id :number) :any{
      return this.httpClient.delete(`http://localhost:52295/api/Line/${id}`);
    }
}
