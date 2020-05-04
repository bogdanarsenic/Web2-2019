import { Component, OnInit } from '@angular/core';
import { User } from '../classes/User';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Login } from '../classes/Login';
import { ServicesService } from '../services/services.service';
import { Router } from '@angular/router';
import { CustomValidators } from '../validator/customValidator';
import { MatchPassword } from '../MatchPassword';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[ServicesService]
})
export class RegisterComponent {

  
  korisnik:User;
  registerUserForm:FormGroup;
  user:User;
  currentUser:Login;
  image:any;
  validationMessage:string="";
  errors: any[] = [];
  

  selectedFile :any;
  localUrl: any[];
  imageShow : any;
  
  constructor (private fb:FormBuilder,private registerService:ServicesService, private router:Router){
    this.createForm();
  }

  createForm()
  {
    this.registerUserForm=this.fb.group({
      Name: ["",[Validators.required]],
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

  onFileChanged(event)
  {
    //this.selectedFile = event.target.value;
    this.selectedFile = event.target.files[0]
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {
     this.imageShow = (<FileReader>event.target).result;
  }
}

  onSubmit()
  {
    if(this.registerUserForm !=null)
    {
      this.user = new User;
      this.user.Name = this.registerUserForm.value.Name;
      this.user.LastName = this.registerUserForm.value.LastName;
      this.user.Email = this.registerUserForm.value.Email;
      this.user.Address = this.registerUserForm.value.Address;
      this.user.Password = this.registerUserForm.value.Password;
      this.user.ConfirmPassword = this.registerUserForm.value.ConfirmPassword;
      this.user.DateOfBirth = this.registerUserForm.value.DateOfBirth;
      this.user.ImageUrl = this.image;
      this.user.Type = this.registerUserForm.value.Type;
      this.user.Status="InProgress";

      this.Registrate(this.user);
    }
  }

  get f() { return this.registerUserForm.controls; }

  Registrate(user:User)
    {


    this.registerService.RegistrationGuest(user).subscribe(
      data=>{

        
              
        this.registerService.getTheToken(new Login(user.Email,user.Password))
          .subscribe(
            res=>
            {
              
              let jwt=res.access_token;

              let jwtData = jwt.split('.')[1]
                let decodedJwtJsonData = window.atob(jwtData)
                let decodedJwtData = JSON.parse(decodedJwtJsonData)

                let role = decodedJwtData.role
                console.log(role);

                localStorage.setItem('jwt', jwt)
                localStorage.setItem('role', role)
                
                this.router.navigate(['']).then(()=>window.location.reload());
                
            },err => {
              this.validationMessage = err.error.error_description;
                      console.log(err);
            }
          )
    },
    error =>
    {
        console.log(error);
        for(var key in error.error.ModelState){
          for (var i = 0; i < error.error.ModelState[key].length; i++) {
            this.errors.push(error.error.ModelState[key][i]);
          }
        }
    }
  
    )
    this.registerUserForm.reset();
  }
    
  
    
    
  }



