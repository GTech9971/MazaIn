import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiInjectionReportService } from 'src/app/domain/services/MazaiInjectionReport.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {
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
      return this.TodayCoffeInInTakePer - this._latestMazaiInjection.MzaiCoffeIn / this.RECOMMEND_COFFEIN;
    }
    return this.TodayCoffeInInTakePer;
  }
  get LatestSugarPer(): number {
    if (this.isNavInjectionPage) {
      return this.TodaySugarInTakePer - this._latestMazaiInjection.MazaiSugar / this.RECOMMEND_SUGAR;
    }
    return this.TodaySugarInTakePer
  }
  get LatestKcalPer(): number {
    if (this.isNavInjectionPage) {
      return this.TodayKcalInTakePer - this._latestMazaiInjection.MazaiKcal / this.RECOMMEND_KCAL;
    }
    return this.TodayKcalInTakePer;
  }
  readonly latestMazaiInjectionObserver: Observable<MazaiData>;

  //今日のカフェイン
  _todayCoffeInInTake: number;
  get TodayCoffeInInTakePer(): number { return this._todayCoffeInInTake / this.RECOMMEND_COFFEIN; }
  readonly todayCoffeInInTakeObserver: Observable<number>;
  //今日の糖質
  _todaySugarInTake: number;
  get TodaySugarInTakePer(): number { return this._todaySugarInTake / this.RECOMMEND_SUGAR; }
  readonly todaySugarInTakeObserver: Observable<number>;
  //今日のカロリー
  _todayKcalInTake: number;
  get TodayKcalInTakePer(): number { return this._todayKcalInTake / this.RECOMMEND_KCAL; }
  readonly todayKcalInTakeObserver: Observable<number>;

  constructor(private router: ActivatedRoute,
    private injectionReportService: MazaiInjectionReportService) {
    this.todayCoffeInInTakeObserver = this.injectionReportService.TodayCoffeInInTakeObserver;
    this.todayCoffeInInTakeObserver.pipe(takeUntil(this.destroy$)).subscribe(val => { this._todayCoffeInInTake = val; });

    this.todaySugarInTakeObserver = this.injectionReportService.TodaySugarInTakeObserver;
    this.todaySugarInTakeObserver.pipe(takeUntil(this.destroy$)).subscribe(val => { this._todaySugarInTake = val; });

    this.todayKcalInTakeObserver = this.injectionReportService.TodayKcalInTakeObserver;
    this.todayKcalInTakeObserver.pipe(takeUntil(this.destroy$)).subscribe(val => { this._todayKcalInTake = val; });

    this.latestMazaiInjectionObserver = this.injectionReportService.LatestMazaiInjectiondObserver;
    this.latestMazaiInjectionObserver.pipe(takeUntil(this.destroy$)).subscribe(latest => { this._latestMazaiInjection = latest; });
  }

  async ngOnInit() {
    await this.injectionReportService.fetchTodayCoffeInInTake();
    await this.injectionReportService.fetchTodaySugarInTake();
    await this.injectionReportService.fetchTodayKcalInTake();

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

}
