import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EnergyInjectionReportData } from 'src/app/domain/models/EnergyInjectionReport.data';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiHelpContextData } from 'src/app/domain/models/MazaiHelpContext.data';
import { MazaiInjectionShareModel } from 'src/app/domain/models/MazaiInjectionShare.model';
import { MazaiInjectionHelperService } from 'src/app/domain/services/MazaiInjectionHelper.service';
import { MazaiInjectionReportService } from 'src/app/domain/services/MazaiInjectionReport.service';
import { MazaiShareService } from 'src/app/domain/services/MazaiShare.service';


@Component({
  selector: 'app-helper-card',
  templateUrl: './helper-card.component.html',
  styleUrls: ['./helper-card.component.scss'],
})
export class HelperCardComponent implements OnInit, OnDestroy {

  /**
   * 魔剤から得たエナジー
   */
  @Input() energyReport: EnergyInjectionReportData;

  private destroy$: Subject<void> = new Subject<void>();

  // _helperComment: MazaiHelpContextData;
  // readonly helperCommentObserver: Observable<MazaiHelpContextData>;

  //今日接種した魔剤リスト
  _todayMazaiInjectionList: MazaiData[];
  readonly mazaiInjectionListObserver: Observable<MazaiData[]>;

  constructor(private injectionHelperService: MazaiInjectionHelperService,
    private injectionReportService: MazaiInjectionReportService,
    private mazaiShareService: MazaiShareService) {
    //TODO ヘルプコメントは一旦なし
    // this.helperCommentObserver = this.injectionHelperService.HelperCommentObserver;
    // this.helperCommentObserver.pipe(takeUntil(this.destroy$)).subscribe(comment => { this._helperComment = comment; });

    this._todayMazaiInjectionList = [];
    this.mazaiInjectionListObserver = this.injectionReportService.TodayMazaiInjectionListObserver;
    this.mazaiInjectionListObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._todayMazaiInjectionList = list });
  }

  get now(): Date { return new Date(); }

  async ngOnInit() {
    //TODO ヘルプコメントは一旦なし
    //await this.injectionHelperService.fetchHelperComment(this.energyReport);    

    await this.injectionReportService.fetchTodayMazaiInjectionList();
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
