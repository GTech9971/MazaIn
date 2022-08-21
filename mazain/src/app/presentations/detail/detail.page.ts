import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EnergyInjectionReportData } from 'src/app/domain/models/EnergyInjectionReport.data';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiInjectionReportService } from 'src/app/domain/services/MazaiInjectionReport.service';
import { MazaiShowcaseComponent } from '../share/mazai-showcase/mazai-showcase.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {
  @ViewChild('mazaiShowCase') mazaiShowCase: MazaiShowcaseComponent;

  /** 推奨一日のカフェイン摂取量 */
  readonly RECOMMEND_COFFEIN: number = 400 + 100;
  /** 推奨一日の糖質摂取量 (男性：３３０、女性：２７０)*/
  readonly RECOMMEND_SUGAR: number = 330 + 100;
  /** 推奨一日のカロリー摂取量（女性１４００〜２０００、男子２０００〜２４００） */
  readonly RECOMMEND_KCAL: number = 2400 + 100;

  /** 注入ページから遷移したかどうか */
  isNavInjectionPage: boolean;

  private readonly destroy$: Subject<void> = new Subject<void>();

  //最後に取得した魔剤
  _latestMazaiInjection: MazaiData;
  get LatestCoffeInPer(): number {
    //注入ページから遷移した場合、プログレスバーに注入分のバッファを表示させる
    if (this.isNavInjectionPage) {
      return this.TodayCoffeInInTakePer - this._latestMazaiInjection?.MzaiCoffeIn / this.RECOMMEND_COFFEIN;
    }
    return this.TodayCoffeInInTakePer;
  }
  get LatestSugarPer(): number {
    if (this.isNavInjectionPage) {
      return this.TodaySugarInTakePer - this._latestMazaiInjection?.MazaiSugar / this.RECOMMEND_SUGAR;
    }
    return this.TodaySugarInTakePer
  }
  get LatestKcalPer(): number {
    if (this.isNavInjectionPage) {
      return this.TodayKcalInTakePer - this._latestMazaiInjection?.MazaiKcal / this.RECOMMEND_KCAL;
    }
    return this.TodayKcalInTakePer;
  }
  readonly latestMazaiInjectionObserver: Observable<MazaiData>;

  //今日の接種したエナジー
  _todayEnergyReport: EnergyInjectionReportData;
  readonly todayEnergyReportObserver: Observable<EnergyInjectionReportData>;

  //今日のカフェイン  
  get TodayCoffeInInTakePer(): number { return this._todayEnergyReport?.CoffeInIntake / this.RECOMMEND_COFFEIN; }
  //今日の糖質  
  get TodaySugarInTakePer(): number { return this._todayEnergyReport?.SugarInTake / this.RECOMMEND_SUGAR; }
  //今日のカロリー  
  get TodayKcalInTakePer(): number { return this._todayEnergyReport?.KcalInTake / this.RECOMMEND_KCAL; }

  constructor(private router: ActivatedRoute,
    private injectionReportService: MazaiInjectionReportService) {
    this.todayEnergyReportObserver = this.injectionReportService.TodayEnergyReportObserver;
    this.todayEnergyReportObserver.pipe(takeUntil(this.destroy$)).subscribe(report => { this._todayEnergyReport = report; })

    this.latestMazaiInjectionObserver = this.injectionReportService.LatestMazaiInjectiondObserver;
    this.latestMazaiInjectionObserver.pipe(takeUntil(this.destroy$)).subscribe(latest => { this._latestMazaiInjection = latest; });
  }

  async ngOnInit() {
    await this.injectionReportService.fetchTodayEnergyReport();

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
    await this.injectionReportService.fetchTodayEnergyReport();
  }

}
