import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationConst } from 'src/app/consts/Application.const';
import { EnergyType } from 'src/app/consts/EnergyType.conts';
import { EnergyInjectionReportData } from 'src/app/domain/models/EnergyInjectionReport.data';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiInjectionBaseReportService } from 'src/app/domain/services/MazaiInjectionBaseReport.service';
import { MazaiInjectionReportService } from 'src/app/domain/services/MazaiInjectionReport.service';
import { MazaiEnergyInfoPopoverComponent } from '../share/mazai-energy-info-popover/mazai-energy-info-popover.component';
import { MazaiShowcaseComponent } from '../share/mazai-showcase/mazai-showcase.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {
  @ViewChild('mazaiShowCase') mazaiShowCase: MazaiShowcaseComponent;

  get COFFEIN_TYPE(): EnergyType { return EnergyType.CoffeIn; }
  get SUGAR_TYPE(): EnergyType { return EnergyType.Sugar; }
  get KCAL_TYPE(): EnergyType { return EnergyType.Kcal; }

  /** 注入ページから遷移したかどうか */
  isNavInjectionPage: boolean;

  private readonly destroy$: Subject<void> = new Subject<void>();

  //最後に取得した魔剤
  _latestMazaiInjection: MazaiData;
  get LatestCoffeInPer(): number {
    //注入ページから遷移した場合、プログレスバーに注入分のバッファを表示させる
    if (this.isNavInjectionPage) {
      return this.TodayCoffeInInTakePer - this._latestMazaiInjection?.MzaiCoffeIn / ApplicationConst.RECOMMEND_COFFEIN;
    }
    return this.TodayCoffeInInTakePer;
  }
  get LatestSugarPer(): number {
    if (this.isNavInjectionPage) {
      return this.TodaySugarInTakePer - this._latestMazaiInjection?.MazaiSugar / ApplicationConst.RECOMMEND_SUGAR;
    }
    return this.TodaySugarInTakePer
  }
  get LatestKcalPer(): number {
    if (this.isNavInjectionPage) {
      return this.TodayKcalInTakePer - this._latestMazaiInjection?.MazaiKcal / ApplicationConst.RECOMMEND_KCAL;
    }
    return this.TodayKcalInTakePer;
  }
  readonly latestMazaiInjectionObserver: Observable<MazaiData>;

  //今日の接種したエナジー
  _energyReport: EnergyInjectionReportData;
  readonly energyReportObserver: Observable<EnergyInjectionReportData>;

  //今日のカフェイン  
  get TodayCoffeInInTakePer(): number { return this._energyReport?.CoffeInIntake / ApplicationConst.RECOMMEND_COFFEIN; }
  //今日の糖質  
  get TodaySugarInTakePer(): number { return this._energyReport?.SugarInTake / ApplicationConst.RECOMMEND_SUGAR; }
  //今日のカロリー  
  get TodayKcalInTakePer(): number { return this._energyReport?.KcalInTake / ApplicationConst.RECOMMEND_KCAL; }

  constructor(private router: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private injectionReportService: MazaiInjectionBaseReportService) {
    this.energyReportObserver = this.injectionReportService.EnergyReportObserver;
    this.energyReportObserver.pipe(takeUntil(this.destroy$)).subscribe(report => { this._energyReport = report; })

    this.latestMazaiInjectionObserver = this.injectionReportService.LatestMazaiInjectiondObserver;
    this.latestMazaiInjectionObserver.pipe(takeUntil(this.destroy$)).subscribe(latest => { this._latestMazaiInjection = latest; });
  }

  async ngOnInit() {
    await this.injectionReportService.fetchEnergyReport();

    //注入ページから遷移したかどうか
    this.isNavInjectionPage = false;
    this.router.queryParams.pipe(takeUntil(this.destroy$)).subscribe(async params => {
      this.isNavInjectionPage = params?.injection === 'true';
      if (this.isNavInjectionPage) {
        await this.injectionReportService.fetchLatestMazaiInjection();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ionViewDidEnter() {
    await this.mazaiShowCase.refreshData();
    await this.injectionReportService.fetchEnergyReport();
  }

  /**
   * 魔剤エナジー情報のポッポオーバー表示
   * @param energyType 
   */
  async onClickEnergyInfoPopoverBtn(e: Event, energyType: EnergyType) {
    const popover: HTMLIonPopoverElement = await this.popoverCtrl.create({
      event: e,
      component: MazaiEnergyInfoPopoverComponent,
      componentProps: { energyType: energyType }
    });

    await popover.present();
  }

}
