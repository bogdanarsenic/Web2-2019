import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { User } from '../classes/User';
import { Login } from '../classes/Login';
import { CustomValidators } from '../validator/customValidator';
import { MatchPassword } from '../MatchPassword';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
  providers:[ServicesService]
})
export class EditprofileComponent implements OnInit {

  korisnik:User;
  user:User=new User();
  registerUserForm:FormGroup;
  id:string;

  status:string;

  constructor(private editService:ServicesService,private router:Router,private fb:FormBuilder) {
      this.createForm();
   }

   createForm()
  {
    this.registerUserForm=this.fb.group({
      Name: ["",[Validators.required,]],
      LastName:['',Validators.required],
      DateOfBirth:['',Validators.required],
      Email:["", [Validators.email, Validators.required]],
      Address:['',Validators.required],
      Password:["",[
        Validators.required,CustomValidators.patternValidator(/\d/, {hasNumber: true}),
        CustomValidators.patternValidator(/[A-Z]/, {hasCapitalCase: true}),
        CustomValidators.patternValidator(/[a-z]/, {hasSmallCase: true}),
        CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,{hasSpecialCharacters: true}),
        Validators.minLength(8)
      ]],
      ConfirmPassword:["",[Validators.required]],
      ImageUrl:[""],
      Type:["", [Validators.required]]
    },
    {
      validator:MatchPassword.MatchPassword
    });

  }
  ngOnInit() {

    this.status="";
    this.getUser();

  }

  getUser():any{
      this.editService.getUser().subscribe(
      data=>{

          this.user=data;
          this.registerUserForm.value.Email=this.user.Email;
          this.registerUserForm.value.Password=this.user.Password;
          this.registerUserForm.value.Name=this.user.Name;
          this.registerUserForm.value.Surname=this.user.LastName;
          this.registerUserForm.value.Address=this.user.Address;
          this.registerUserForm.value.DateOfBirth=this.user.DateOfBirth;
          this.registerUserForm.value.ConfirmPassword=this.user.ConfirmPassword;
          this.registerUserForm.value.ImageUrl=this.user.ImageUrl;
          this.registerUserForm.value.Type=this.user.Type;
          this.status=this.user.Status;

          console.log(this.registerUserForm);

      },
      err=>{
        alert("Something went wrong");
      })
  }

  get f() { return this.registerUserForm.controls; }

  onSubmit()
  {
      this.Update(this.user)
  }

  Update(user:User)
  {


    this.user.Name = this.registerUserForm.value.Name;
    this.user.LastName = this.registerUserForm.value.LastName
    this.user.Email = this.registerUserForm.value.Email;
    this.user.Address = this.registerUserForm.value.Address;
    this.user.Password = this.registerUserForm.value.Password;
    this.user.ConfirmPassword = this.registerUserForm.value.ConfirmPassword;
    this.user.DateOfBirth = this.registerUserForm.value.DateOfBirth;
    this.user.ImageUrl = this.registerUserForm.value.ImageUrl;
    this.user.Type = this.registerUserForm.value.Type;
    
    var u = this.user;
    u.Name = this.user.Name+'|'+this.user.Password;
    this.id = this.user.Email.split('@')[0];
   
    console.log(this.user);

    this.editService.putApplicationUsers(this.id,u).subscribe(
      data=>{

                console.log('ok');
                this.router.navigate(['']);
                
            },
            error=>
            {
              
              alert("Username doesn't exist. Usernames needs to match!")
            }
          )
    
  }



}