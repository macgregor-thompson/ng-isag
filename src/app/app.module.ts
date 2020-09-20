import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GolfersModule } from './golfers/golfers.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './_shared/shared.module';
import { AngularMaterialModule } from './_angular-material/angular-material.module';
import { CoreModule } from './_core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    AngularMaterialModule,

    CoreModule,
    HttpClientModule,
    SharedModule,

    GolfersModule,
    HomeModule,


    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
