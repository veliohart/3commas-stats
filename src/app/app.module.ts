import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MaterialModule } from './modules/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { COMPONENTS } from './components';

import { AccountsModule } from './services/accounts/accounts.module';

import { HomePage } from './pages/home/home.page';
import { AccountsPage } from './pages/accounts/accounts.page'; 
import { interceptor } from './interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS,
    
    HomePage,
    AccountsPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,

    NgxChartsModule,

    AccountsModule
  ],
  providers: [interceptor],
  bootstrap: [AppComponent]
})
export class AppModule { }
