import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MarkerInfo } from './model/marker-info.model';
import { GeoLocation } from './model/geolocation';
import { Polyline } from './model/polyline';
import { ServicesService } from '../services/services.service';
import { MapsAPILoader } from '@agm/core';
import { Station } from '../classes/Station';
import { Router } from '@angular/router';
import { Line } from '../classes/Line';
import { ModalService } from '../services/modal.service';
import { MatDialog } from '@angular/material/dialog';
import { StationLine } from '../classes/StationLine';
import { TimeTable } from '../classes/TimeTable';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  styles: ['agm-map {height: 500px; width: 700px;}','app/map/modal.less'],
  providers: [ServicesService] //postavljamo sirinu i visinu mape
})
export class MapComponent implements OnInit {

  markerInfo: MarkerInfo;
  public polyline: Polyline;
  public zoom: number;
  showAdmin:boolean;
  bodyText:string;
  bodyText1:string;

  
  lines:Array<Line>=[];
  timetables:Array<TimeTable>=[];
  lineNames:Array<any>=[];
  allStationLines:Array<any>=[];
  stationsDraw:Array<Station>=[];
  radioSel:string;

  station:Station;
  line:Line;

  lineEdit:Line;
  allStations:Array<Station>=[];

  stations:Array<Station>=[];
  
  stationId:string;
  stationIds:Array<any>=[];

  edit:boolean;

  private geoCoder;
  address:string;
  prvo:string;

  stationName:string;
  stationAddress:string;
  stationClicked:Station;

  nesto:string[];

  lineId:number;

  nestonesto:boolean;

  id:string;

  i:number;

  location:GeoLocation;

  line2:Line;

  stationEdit:Station = new Station();
  stationEditID : number;
  editStation:boolean;

 radioSelected:string;

 stationLine:StationLine;
  check:string;

  constructor(private ngZone: NgZone,private serverService:ServicesService,private modalService:ModalService,private mapsAPILoader:MapsAPILoader,private router:Router){
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954), 
    "assets/ftn.png",
    "Jugodrvo" , "" , "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");

    this.polyline = new Polyline([], 'blue', { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}});
  }

  ngOnInit() {

    this.bodyText='';
    this.check="";
    this.bodyText1="";
    this.i=0;

    if(localStorage.role=="Admin")
    {
      this.showAdmin=true;
    }

    else
    {
      this.showAdmin=false;
    }

    this.callGetLines();
    this.callGetStation();
    this.callGetStationLine();


    this.station=new Station();
    this.stationClicked=new Station();
    this.line=new Line();
    this.stations=[];
    this.lines=[];
    this.allStations=[];
    this.timetables=[];
    this.radioSel="";
    this.radioSelected="";
    this.editStation=false;

    

    this.mapsAPILoader.load().then(() => {

      this.geoCoder = new google.maps.Geocoder;
     // this.getAddress(45.242268, 19.842954); //proba

    });

  }



  callGetLines()
  {
    this.serverService.getAllLines().subscribe
    (
      data=>
      {
          this.lines=data;
          this.lines.forEach(
            element=>
            {
              this.lineNames.push(element.Name);             
            }
          )

        this.lineNames.sort((function(a, b){return a-b}));
      }
    )

  }

  callGetStation()
  {
      this.serverService.getAllStations().subscribe(
        data=>{
          this.allStations=data;
        }
      )
  }

  callGetStationLine(){
    this.serverService.getAllStationLines()
      .subscribe(
        data => {
          this.allStationLines = data;  
             
        },
        error => {
          console.log(error);
        }
      )
  }
//--------------------------------------------

  placeMarker($event){

    if(this.showAdmin)
    {
      this.openModal('custom-modal-1');
      this.getAddress($event.coords.lat, $event.coords.lng);
      this.location = new GeoLocation($event.coords.lat, $event.coords.lng);
      this.markerInfo = new MarkerInfo(new GeoLocation($event.coords.lat, $event.coords.lng),
        "assets/bg.png",
        "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
      console.log(this.polyline)
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 11;
          this.address = results[0].formatted_address;

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }



  save()
  {
    if(this.bodyText!="")
    {

        this.polyline.addLocation(this.location)
        this.station=new Station();
        this.stationLine = new StationLine();
        this.station.Name = this.bodyText;
        this.station.Address = this.address;
        this.station.CoordinateX = this.location.latitude;
        this.station.CoordinateY = this.location.longitude;

        this.modalService.close('custom-modal-1');
        this.bodyText = '';
        this.postStation();
  }
  else{
    alert("You need to put station name");
  }
  }

  postStation(){
    this.station.Address = this.address;
    this.serverService.postStation(this.station)
        .subscribe(
          data =>{
            this.stationId = data.Id;
            this.postStationLine();
           console.log("Poslata stanica.");
          },
          error => {
            console.log(error);
          }
        )
  }

  postStationLine(){
    
    this.stationLine.LineId = this.lineId;
    this.stationLine.StationId = this.stationId;
    this.serverService.postStationLine(this.stationLine)
        .subscribe(
          data =>{
           console.log("Poslata stationline.");
          },
          error => {
            console.log(error);
          }
        )
  }

  postLine(){
    this.serverService.postLine(this.line)
        .subscribe(
          data =>{
            this.lineId = data.Id;
           console.log("Poslata linija.");
           this.router.navigate(['/lines']).then(()=>window.location.reload()); 
          },
          error => {
            console.log(error);
          }
        )
  }
  

  openModal(id: string) {
   this.modalService.open(id);
  }

  closeModal(id: string) {
  this.modalService.close(id);
  }

  createLine(){


    var i=this.lines.findIndex(x=>x.Name===this.bodyText1);

    if(this.bodyText1!="" && i==-1){
      this.polyline.path = [];
      this.stationIds = [];
      this.stationsDraw = [];
      this.line = new Line();
      this.line.Name = this.bodyText1;
      this.modalService.close('custom-modal-2');
      this.bodyText1 = "";
      this.postLine();
    }
    else if(i!=-1){
      alert("There is already line with that name");
    }
    else
     {
       alert("You need to put the name of a line");
     }

  }

onItemChange(line)
{
    this.polyline.path=[];

    this.stationsDraw = [];

    this.stationIds = [];
    this.stationsDraw = [];
    this.radioSelected=line;
    this.radioSel = this.lineNames.find(Item => Item === this.radioSelected);
    var lineName =  line;

    this.lineId = this.lines.find(Line => Line.Name == lineName).Id;

    this.lineEdit = this.lines.find(Line => Line.Name == lineName);

    this.allStationLines.forEach(sl=>{
      if(sl.LineId==this.lineId)
        this.stationIds.push(sl.StationId);
    });

    this.stationIds.forEach(s=>{
      this.stationsDraw.push(this.allStations.find(x=>x.Id==s));
    });

    this.stationsDraw.forEach(s=>{
      this.polyline.addLocation(new GeoLocation(s.CoordinateX,s.CoordinateY));
    });
  }


clickedMarker(point) {
  this.allStations.forEach(x=>{
    if(x.CoordinateX==point.latitude && x.CoordinateY==point.longitude){
      this.stationClicked = x;   
      this.stationEdit = x; 
      this.stationEditID = x.Id;
    }
  });
  this.editStation=true;
}

UpdateLine()
  {
    var i=this.lineNames.findIndex(x=>x===this.lineEdit.Name);

    if(i==-1 && this.lineEdit.Name!="")
    {
        this.serverService.putLine(this.lineId, this.lineEdit)
        .subscribe(
          data => {
            //this.stations = data;  
        
          },
          error => {
            console.log(error);
          }
        )

        this.UpdateTimetable();
        this.router.navigate(['/lines']).then(()=>window.location.reload());  
        }
    
    else
    {
        alert("You need to pick another name.");
    }
  }
UpdateTimetable()
{

    this.check=this.radioSelected;
    this.serverService.getTimetablebyLineid(this.check).subscribe(
      data=>
      {
            this.timetables=data;

            if(data!=null)
              {  
                  this.UpdateTimetable2();
              }

      }
    )
 }

 UpdateTimetable2()
 {
  
      this.timetables.forEach(x=>x.LineId=this.lineEdit.Name);
      
      this.timetables.forEach(
        x=>
          this.serverService.putTimeTable(x.Id,x).subscribe(
            data=>
          {

          }
          )         
      )   
 }
  UpdateStation()
  {
    this.serverService.putStation(this.stationEditID, this.stationEdit)
    .subscribe(
      data => {
        this.router.navigate(['/lines']).then(()=>window.location.reload());  
      },
      error => {
        console.log(error);
      }
    )
    
  }

  deleteLine(){

    if(this.radioSelected!="")
    {
        this.serverService.deleteLine(this.lineId)
        .subscribe(
          data => {
            console.log("OK");  
            this.router.navigate(['/lines']).then(()=>window.location.reload());   
          },
          error => {
            console.log(error);
          }
        )
     }
    else
    {
        alert("You need to check line that you want to delete");
    }
  }

  deleteStation(){
    this.serverService.deleteStation(this.stationEditID)
    .subscribe(
      data => {
        this.router.navigate(['/lines']).then(()=>window.location.reload());  
        console.log("OK");     
      },
      error => {
        console.log(error);
      }
    )
  }
  

  Edit()
  {
    if(this.radioSelected!="")
    {
      this.edit=true;
    }
    else
    {
      alert("You need to check some line if you want to edit it")
    }
  }

}
