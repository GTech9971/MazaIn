import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { addDays } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiInjectionShareModel } from 'src/app/domain/models/MazaiInjectionShare.model';
import { MazaiInjectionVariableReportService } from 'src/app/domain/services/MazaiInjectionVariableReport.service';
import { MazaiShareService } from 'src/app/domain/services/MazaiShare.service';
//import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-helper-card',
  templateUrl: './helper-card.component.html',
  styleUrls: ['./helper-card.component.scss'],
})
export class HelperCardComponent implements OnInit, OnDestroy {
  // @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  @ViewChild('slides') slides: IonSlides;

  private prevSlideIndex: number;

  private destroy$: Subject<void> = new Subject<void>();


  //今日接種した魔剤リスト
  _todayMazaiInjectionList: MazaiData[];
  readonly mazaiInjectionListObserver: Observable<MazaiData[]>;

  weekDateList: { date: Date, dateLabel: string }[];
  readonly WorkDate: Date;

  constructor(private injectionReportService: MazaiInjectionVariableReportService,
    private mazaiShareService: MazaiShareService,) {

    this.WorkDate = new Date();
    this.weekDateList = [];
    this._todayMazaiInjectionList = [];
    this.mazaiInjectionListObserver = this.injectionReportService.MazaiInjectionListObserver;
    this.mazaiInjectionListObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._todayMazaiInjectionList = list });
  }

  async ngOnInit() {
    await this.injectionReportService.fetchMazaiInjectionList();

    // 過去1週間分のデータを作る
    let tmp: Date = new Date(this.WorkDate);
    this.weekDateList.push({ date: tmp, dateLabel: "今日" });
    for (let i = 0; i < 6; i++) {
      tmp = addDays(tmp, -1);
      this.weekDateList.push({ date: tmp, dateLabel: `${i + 1}日前` });
    }
    this.weekDateList = this.weekDateList.reverse();
    //this.swiper.swiperRef.activeIndex = 7;
    await this.slides.slideTo(7);

    //動的に日付を移動させる影響でonSlideChangeが実行されて日付が1日ずれてしまうので進めている
    //this.prevSlideIndex = this.swiper.swiperRef.activeIndex
    this.prevSlideIndex = await this.slides.getActiveIndex();
    await this.injectionReportService.nextWorkDate();
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

  /**
   * 日付スライド変更時   
   */
  async onChangeSlide() {
    // if (this.prevSlideIndex < this.swiper.swiperRef.activeIndex) {
    //   await this.injectionReportService.nextWorkDate();
    // } else {
    //   await this.injectionReportService.prevWorkDate();
    // }

    if (this.prevSlideIndex < await this.slides.getActiveIndex()) {
      await this.injectionReportService.nextWorkDate();
    } else {
      await this.injectionReportService.prevWorkDate();
    }
    this.prevSlideIndex = await this.slides.getActiveIndex();

    //this.prevSlideIndex = this.swiper.swiperRef.activeIndex;    
    //TODO なぜかユーザがDetailPageの何かしらの要素をクリックしたらデータが反映される
  }

}