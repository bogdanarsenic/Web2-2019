import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  unapprovedUsers:Array<any> = [];
  

  constructor(private serverService: ServicesService, private router: Router) { }
  
  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    this.serverService.getAllUsers()
    .subscribe(
      data => {
        data.forEach(element => {
          if(!element.Active && (element.Type=="Student" || element.Type=="Regular" || element.Type=="Pensioner") && element.Status=="InProgress"){
            this.unapprovedUsers.push(element);
          }
        });
      },
      error => {
        console.log(error);
      }
    )
  }
  

  approveUser(user){
    user.Active = true;
    user.Status="Approved";
    this.serverService.putApplicationUsers(user.Id,user)
    .subscribe(
      data =>{
       console.log("OK");
       this.router.navigate(['']).then(()=>window.location.reload());

      },
      error => {
        console.log(error);
      }
    )
  }

  refuseUser(user){
    user.Active = false;
    user.Status="Denied";
    this.serverService.putApplicationUsers(user.Id,user)
    .subscribe(
      data =>{

       console.log("OK");
       this.router.navigate(['']).then(()=>window.location.reload());

      },
      error => {
        console.log(error);
      }
    )
  }

}
