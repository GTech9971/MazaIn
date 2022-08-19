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
import { MazaiInjectionHelperRepository } from './domain/repositories/MazaiInjectionHelper.repository';
import { MockMazaiInjectionHelperRepository } from './infra/MazaiInjectionHelperRepository/MockMazaiInjectionHelper.repository';
import { MazaiInjectionWeekReportRepository } from './domain/repositories/MazaiInjectionWeekReport.repository';
import { MockMazaiInjectionWeekReportRepository } from './infra/MazaiInjectionWeekReportRepository/MockMazaiInjectionWeekReport.repository';

const MOCK: Provider[] = [
  { provide: MazaiRepository, useClass: MockMazaiRepository },
  { provide: MazaiInjectionReportRepository, useClass: MockMazaiInjectionReportRepository },
  { provide: MazaiInjectionHelperRepository, useClass: MockMazaiInjectionHelperRepository },
  { provide: MazaiInjectionWeekReportRepository, useClass: MockMazaiInjectionWeekReportRepository },
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
