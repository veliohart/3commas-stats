import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './modules/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';

import { AccountsModule } from './services/accounts/accounts.module';

import { HomePage } from './pages/home/home.page';
import { AccountsPage } from './pages/accounts/accounts.page'; 
import { interceptor } from './interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    
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

    AccountsModule
  ],
  providers: [interceptor],
  bootstrap: [AppComponent]
})
export class AppModule { }
