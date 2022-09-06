import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EnergyInjectionReportData } from 'src/app/domain/models/EnergyInjectionReport.data';
import { MazaiHelpContextData } from 'src/app/domain/models/MazaiHelpContext.data';
import { MazaiInjectionHelperService } from 'src/app/domain/services/MazaiInjectionHelper.service';
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

  constructor(private injectionHelperService: MazaiInjectionHelperService,
    private mazaiShareService: MazaiShareService) {
    //TODO ヘルプコメントは一旦なし
    // this.helperCommentObserver = this.injectionHelperService.HelperCommentObserver;
    // this.helperCommentObserver.pipe(takeUntil(this.destroy$)).subscribe(comment => { this._helperComment = comment; });
  }

  get now(): Date { return new Date(); }

  async ngOnInit() {
    //TODO ヘルプコメントは一旦なし
    //await this.injectionHelperService.fetchHelperComment(this.energyReport);    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  /**
   * シェアボタン押下時
   */
  async onClickShareBtn() {
    if (await this.mazaiShareService.canUseShare() === false) {
      console.warn("ios native support only");
      return;
    }

    //TODO シェアモデルの生成
    await this.mazaiShareService.shareMazai(undefined);

  }

}
