import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {Routes, RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavigationComponent } from './navigation/navigation.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {ServicesService} from './services/services.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TimetableComponent } from './timetable/timetable.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { ValidateComponent } from './validate/validate.component';
import { VerifyComponent } from './verify/verify.component';

import {CanActivateViaAdminGuard} from './guards/admin.guard';
import {CanActivateViaUserGuard} from './guards/user.guard';
import {CanActivateViaControllerGuard} from './guards/controller.guard';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { PricelistComponent } from './pricelist/pricelist.component';
import { MapComponent } from './map/map.component';
import {AgmCoreModule} from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { NotificationService } from './services/notification.service';
import { HttpClickService } from './services/click-http.service';


const appRoutes:Routes=[
  { path: 'register',component:RegisterComponent},
  { path: 'login',component:LoginComponent},
  { path: 'timetable',component:TimetableComponent},
  { path: 'vehicles',component:VehiclesComponent},
  { path: 'verify',component:VerifyComponent},
  { path: 'validate',component:ValidateComponent},
  { path: 'pricelist',component:PricelistComponent},
  { path: 'editprofile',component:EditprofileComponent},
  { path: 'lines', component:MapComponent}


];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavigationComponent,
    TimetableComponent,
    VehiclesComponent,
    ValidateComponent,
    VerifyComponent,
    EditprofileComponent,
    MapComponent,
    PricelistComponent,
    ModalComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDnihJyw_34z5S1KZXp90pfTGAqhFszNJk'}),
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,


  ],
  providers: [
    CanActivateViaAdminGuard,
    CanActivateViaControllerGuard,
    CanActivateViaUserGuard,

    NotificationService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    HttpClickService
    ],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
