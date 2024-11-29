// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GithubIntegrationComponent } from './components/github-integration/github-integration.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import {MatExpansionModule} from "@angular/material/expansion";
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import { OrganizationComponent } from './components/organization/organization.component';
import { OrganizationService } from './services/organization.service'; // Import the service

@NgModule({
  declarations: [
    AppComponent,
    GithubIntegrationComponent,
    OrganizationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatTableModule,
  ],
  providers: [OrganizationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
