import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MazaiRepository } from './domain/repositories/Mazai.repository';
import { MockMazaiRepository } from './infra/MazaiRepository/MockMazai.repository';
import { MazaiInjectionReportRepository } from './domain/repositories/MazaiInjectionReport.repository';
import { MockMazaiInjectionReportRepository } from './infra/MazaiInjectionReportRepository/MockMazaiInjectionReport.repository';

const MOCK: Provider[] = [
  { provide: MazaiRepository, useClass: MockMazaiRepository },
  { provide: MazaiInjectionReportRepository, useClass: MockMazaiInjectionReportRepository },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MOCK,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
