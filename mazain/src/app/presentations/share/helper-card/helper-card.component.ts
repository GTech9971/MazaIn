import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { addDays } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EnergyInjectionReportData } from 'src/app/domain/models/EnergyInjectionReport.data';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiInjectionShareModel } from 'src/app/domain/models/MazaiInjectionShare.model';
import { MazaiInjectionReportService } from 'src/app/domain/services/MazaiInjectionReport.service';
import { MazaiShareService } from 'src/app/domain/services/MazaiShare.service';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-helper-card',
  templateUrl: './helper-card.component.html',
  styleUrls: ['./helper-card.component.scss'],
})
export class HelperCardComponent implements OnInit, OnDestroy {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  /**
   * 魔剤から得たエナジー
   */
  @Input() energyReport: EnergyInjectionReportData;

  private destroy$: Subject<void> = new Subject<void>();


  //今日接種した魔剤リスト
  _todayMazaiInjectionList: MazaiData[];
  readonly mazaiInjectionListObserver: Observable<MazaiData[]>;

  weekDateList: Date[] = [];
  WorkDate: Date = new Date();

  constructor(private injectionReportService: MazaiInjectionReportService,
    private mazaiShareService: MazaiShareService) {

    this._todayMazaiInjectionList = [];
    this.mazaiInjectionListObserver = this.injectionReportService.TodayMazaiInjectionListObserver;
    this.mazaiInjectionListObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._todayMazaiInjectionList = list });
  }

  async ngOnInit() {
    await this.injectionReportService.fetchTodayMazaiInjectionList();

    // 過去1週間分のデータを作る
    let tmp: Date = new Date(this.WorkDate);
    this.weekDateList.push(tmp);
    for (let i = 0; i < 6; i++) {
      tmp = addDays(tmp, -1);
      this.weekDateList.push(tmp);
    }
    this.weekDateList = this.weekDateList.reverse();
    this.swiper.swiperRef.activeIndex = 7;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  /**
   * シェアボタン押下時
   */
  async onClickShareBtn() {
    //今日注入した魔剤をシェア
    if (await this.mazaiShareService.canUseShare() === false) {
      console.warn("ios native support only");
      return;
    }

    //今日注入した魔剤をシェア
    const mazaiInjectionShareModel: MazaiInjectionShareModel = new MazaiInjectionShareModel(this._todayMazaiInjectionList);
    await this.mazaiShareService.shareMazai(mazaiInjectionShareModel);
  }

}