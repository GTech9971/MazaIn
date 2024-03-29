import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationConst } from 'src/app/consts/Application.const';
import { EnergyType } from 'src/app/consts/EnergyType.conts';
import { EnergyInjectionReportData } from 'src/app/domain/models/EnergyInjectionReport.data';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiInjectionVariableReportService } from 'src/app/domain/services/MazaiInjectionVariableReport.service';
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
      return this.CoffeInInTakePer - this._latestMazaiInjection?.MzaiCoffeIn / ApplicationConst.RECOMMEND_COFFEIN;
    }
    return this.CoffeInInTakePer;
  }
  get LatestSugarPer(): number {
    if (this.isNavInjectionPage) {
      return this.SugarInTakePer - this._latestMazaiInjection?.MazaiSugar / ApplicationConst.RECOMMEND_SUGAR;
    }
    return this.SugarInTakePer;
  }
  get LatestKcalPer(): number {
    if (this.isNavInjectionPage) {
      return this.KcalInTakePer - this._latestMazaiInjection?.MazaiKcal / ApplicationConst.RECOMMEND_KCAL;
    }
    return this.KcalInTakePer;
  }
  readonly latestMazaiInjectionObserver: Observable<MazaiData>;

  //今日の接種したエナジー
  _energyReport: EnergyInjectionReportData;
  readonly energyReportObserver: Observable<EnergyInjectionReportData>;

  //摂取カフェイン  
  get CoffeInInTakePer(): number { return this._energyReport?.CoffeInIntake / ApplicationConst.RECOMMEND_COFFEIN; }
  //摂取糖質  
  get SugarInTakePer(): number { return this._energyReport?.SugarInTake / ApplicationConst.RECOMMEND_SUGAR; }
  //摂取カロリー  
  get KcalInTakePer(): number { return this._energyReport?.KcalInTake / ApplicationConst.RECOMMEND_KCAL; }

  //プログレスバーの色
  private getProgressColor(per: number): string {
    if (!per) { return 'primary'; }
    if (per < 0.65) { return 'primary'; }
    if (per > 0.65 && per < 0.9) { return 'warning'; }
    if (per > 0.9) { return 'danger'; }
  }
  //カフェインプログレスバーの色
  get CoffeInProgressColor(): string { return this.getProgressColor(this.CoffeInInTakePer); }
  // 糖質プログレスバーの色
  get SugarProgressColor(): string { return this.getProgressColor(this.SugarInTakePer); }
  // カロリープログレスバーの色
  get KcalProgressColor(): string { return this.getProgressColor(this.KcalInTakePer); }

  constructor(private router: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private injectionReportService: MazaiInjectionVariableReportService) {
    this.energyReportObserver = this.injectionReportService.EnergyReportObserver;
    this.energyReportObserver.pipe(takeUntil(this.destroy$)).subscribe(report => { this._energyReport = report; });

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
