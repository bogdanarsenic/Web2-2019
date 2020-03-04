import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {FormGroup,FormBuilder, Validators} from '@angular/forms';
import { Login } from '../classes/Login';
import {ServicesService} from '../services/services.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[ServicesService]
})
export class LoginComponent implements OnInit {

  loginUserForm:FormGroup;
  login:Login;
  id:string;

  constructor(private fb:FormBuilder,private router:Router, private loginService:ServicesService)

  {
    this.createForm();
   }

   createForm()
   {
    this.loginUserForm=this.fb.group(
      {
        Username: ['',Validators.required],
        Password: ['',Validators.required]
      }
    );
   }
  ngOnInit() {
    localStorage.clear();
    this.login=new Login("","");
    localStorage.setItem('CurrentComponent','LoginComponent');

  }

  onSubmit()
  {
      this.login=this.loginUserForm.value;

      this.loginService.getTheToken(this.login).subscribe(
        res=>{

          let jwt=res.access_token;
          let jwtData=jwt.split('.')[1]
          let decodedJwtJsonData=window.atob(jwtData)
          let decodedJwtData=JSON.parse(decodedJwtJsonData)

          let role=decodedJwtData.role
          console.log(role);
          localStorage.setItem('jwt',jwt);
          localStorage.setItem('role',role);
          localStorage.setItem('currentId',this.login.Username);
          this.router.navigate(['']).then(()=>window.location.reload());


        },error=>
        {
          alert("Invalid Username or Password!")
          console.log(error);
        }

      )   

      
      
      this.loginUserForm.reset();

    }
   
  }