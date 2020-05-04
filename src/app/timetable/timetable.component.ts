import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { Router } from '@angular/router';
import { Line } from '../classes/Line';
import { FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { TimeTable } from '../classes/TimeTable';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  lines:Array<Line>

  lineNames:Array<any>

  timeTable:Array<any>

  cityLines:Array<any>
  subLines:Array<any>
  isAdmin:boolean;
  line:Line;
  id:string;
  i:number;
  j:string;
  times:string;
  times2:string[];

  idTT:string;

  timetable:TimeTable
  timetables:Array<TimeTable>

  days: Array<string> = ["Weekday", "Saturday", "Sunday"];

  day:string;

  daychecked:boolean;

  lineId:string;

  broj:Array<any>;

  radioSelected:string;

  timetableForm:FormGroup;

  edit:boolean

  suburban:boolean;
  city : boolean;

  showTT:boolean;

  selected:string;

  provera:number;
  checked:boolean;

  hours:string[];
  minutes:string[];

  constructor(private fb:FormBuilder,private serverService:ServicesService,private router:Router) 
  {
    this.createForm();
  }

  createForm()
  {
    this.timetableForm=this.fb.group({
      "6":[''],
      "7":[""],
      "8":[""],
      "9":[""],
      "10":[""],
      "11":[""],
      "12":[""],
      "13":[""],
      "14":[""],
      "15":[""],
      "16":[""],
      "17":[""],
      "18":[""],
      "19":[""],
      "20":[""],
      "21":[""],
      "22":[""],
  })
}

  ngOnInit(){

    this.callGetLines();
    this.callGetTimetables();
    this.edit=false;
    this.timetables=[];
    this.broj=["6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22"];
    this.j="";
    this.city=false;
    this.suburban=false;
    this.showTT=false;
    this.daychecked=false;
    this.selected="";
    this.day="";
    this.times2=[];
    this.hours=[];
    this.minutes=[];
    this.provera=0;

    this.checked=false;

    if(localStorage.role=="Admin")
    {
      this.isAdmin=true;
    }
    else
    {
      this.isAdmin=false;
    }

    this.lineNames=[];
    this.lines=[];
    this.cityLines=[];
    this.subLines=[];
    this.id="";
    this.i=6;
    this.times="";

    this.timetable=new TimeTable();
  

  }

  onCity()
  {

      this.city=true;
      this.suburban=false;
      this.showTT=false;
      this.times="";
  }

  onSuburban()
  {
    this.times="";
    this.city=false;
    this.suburban=true;
    this.showTT=false;
  }

  callGetTimetables()
  {
    this.serverService.getAllTimetables().subscribe(
      data=>
      {
        this.timetables=data;
      }
     )
  }

  callGetLines()
  {
    this.serverService.getAllLines().subscribe(
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

  getID()
  {
    this.timetables.forEach(x => {
      if(x.LineId == this.id && x.Day == this.day)
      {
        this.idTT = x.Id;
      }
    });
  }

 

  putControl()
  {
    for(this.i=6;this.i<23;this.i++)
    {
      if(this.timetableForm.controls[this.i].value!="")
      {
          this.times=(String)(this.i)+":"+this.timetableForm.controls[this.i].value;

          this.timetable.Times+=this.times+";";
      }
    }

  }

  onSubmit()
  {
    this.timetable.Times="";

    this.putControl();

    if(this.timetable.Times=="" || this.timetable.LineId=="")
    {
      alert("You need to put some time");
    }

    else{
          if(this.edit==true)
          {

              this.timetable.LineId=this.id;
              this.timetable.Day=this.day;

              
              
              this.cityOrsub();
              this.getID();

              this.timetable.Id=this.idTT;
              
              this.serverService.putTimeTable(this.idTT,this.timetable).subscribe(
                data=>
                {
                      console.log("uspesno editovan");   
                      this.router.navigate(['']).then(()=>window.location.reload());     
                }
                )
          }
          else
          {
              this.timetable.LineId=this.id;
              this.timetable.Day=this.day;

              this.cityOrsub();
            
              this.serverService.postTimetable(this.timetable).subscribe(
                data=>
                {
                  this.router.navigate(['']).then(()=>window.location.reload());
                }
              )
          }
        }

     }

  cityOrsub()
  {
      if((Number)(this.id)<=30)
         {
            this.timetable.Type="City";
         }
      else
         {
            this.timetable.Type="Suburban"
         }
  }

  onItemChange(line)
  { 
    this.showTT=false;
      if(line!="")
      {
        this.id=line; 
                

          if(this.id!="" && this.day!="")
          {
            this.provera=1;
          }

        this.checkId();


      }
  }

  checkId()
  {
    var t;
    this.times="";
    t=this.timetables.findIndex(item=>item.Day==this.day && item.LineId==this.id)

    if(t!=-1)
    {  
        this.times=this.timetables[t].Times;
        this.edit=true;     
    }
    else
      this.edit=false;
  }

  Delete()
  {
      this.getID();
      this.serverService.deleteTime(this.idTT).subscribe(
        data=>
        {
          this.router.navigate(['/timetable']).then(()=>window.location.reload());
        }
      )
  }

  checkDay(day)
  {
      this.showTT=false;
      this.daychecked=true;
      this.checked=true;
      this.day=day;

      if(this.city==true)
      {
        this.FindLine("City",this.day);
      }
      else
        {
          this.FindLine("Suburban",this.day);
        }
  }

  FindLine(type:string,day:string)
  { 

        this.times="";
        this.timetables.forEach(x=>  {
          if(x.Type==type && x.Day==day)
          {
 
              if(type=="City")
              {
                 var nameLine=this.lines.find(line => line.Name === x.LineId).Name;

                 if(this.cityLines.indexOf(nameLine)==-1)
                 {
                   this.cityLines.push(nameLine);
                 }   
                 this.cityLines.sort((function(a, b){return a-b}));   
      
              }
              else
              {
                nameLine=this.lines.find(line => line.Name === x.LineId).Name;

                if(this.subLines.indexOf(nameLine)==-1 )
                {
                  this.subLines.push(nameLine);
                }
                this.subLines.sort((function(a, b){return a-b}));
              }
          }

          })
  }

  Show()
  {
      this.showTT=true;
      this.times2=[];
      this.hours=[];
      this.minutes=[];

      if(this.times=="")
      {
        alert("There is no timetable for this day and line yet")
        this.showTT=false;
        this.daychecked=false;
      }

      else
      {
         
         this.times2=this.times.split(';');  
         this.times2.forEach(
            x=>
            {
                this.hours.push(x.split(':')[0]);
                this.minutes.push(x.split(':')[1]);
            }
         )
         this.daychecked=false;
      }
  }
}
