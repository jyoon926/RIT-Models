import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ModelsComponent } from './components/models/models.component';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

import { FormsModule } from '@angular/forms';
import { ModelComponent } from './components/model/model.component';
import { HeaderComponent } from './components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModelsComponent,
    LoginComponent,
    AboutComponent,
    RegisterComponent,
    ProfileComponent,
    ModelComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    HttpClientModule, 
    FormsModule,
    FontAwesomeModule
  ],
  providers: [UserService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
