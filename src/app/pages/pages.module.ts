import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PermissionsModule } from 'app/permissions/permissions.module';

import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';

import { AuthService } from '../services/auth.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    MatIconModule,
    ReactiveFormsModule,
    PermissionsModule,
    MatSnackBarModule,
  ],
  declarations: [
    HomeComponent,
    LandingComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent
  ],
  providers: [
    AuthService,
  ]
})
export class PagesModule { }
