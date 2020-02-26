import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {Routes, RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavigationComponent } from './navigation/navigation.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {ServicesService} from './services/services.service';
import { HttpClientModule } from '@angular/common/http';


const appRoutes:Routes=[
  { path: 'register',component:RegisterComponent},
  { path: 'login',component:LoginComponent},
 
  

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavigationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),

  ],
  providers: [ServicesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
