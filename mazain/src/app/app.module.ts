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
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';
import { MazaiImplRepository } from './infra/MazaiRepository/MazaiImpl.repository';
import { MazaiInjectionReportImplRepository } from './infra/MazaiInjectionReportRepository/MazaiInjectionReportImpl.repository';
import { MazaiInjectionWeekReportImplRepository } from './infra/MazaiInjectionWeekReportRepository/MazaiInjectionWeekReportImpl.repository';

/** Mockを使用するかどうか */
const isMock: boolean = false;

const PROVIDERS: Provider[] = [
  { provide: MazaiRepository, useClass: isMock ? MockMazaiRepository : MazaiImplRepository },
  { provide: MazaiInjectionReportRepository, useClass: isMock ? MockMazaiInjectionReportRepository : MazaiInjectionReportImplRepository },
  { provide: MazaiInjectionHelperRepository, useClass: MockMazaiInjectionHelperRepository },//TODO
  { provide: MazaiInjectionWeekReportRepository, useClass: isMock ? MockMazaiInjectionWeekReportRepository : MazaiInjectionWeekReportImplRepository },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PROVIDERS,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
