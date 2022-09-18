import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiInjectionRecordData } from 'src/app/domain/models/MazaiInjectionRecord.data';
import { MazaiInjectionVariableReportService } from 'src/app/domain/services/MazaiInjectionVariableReport.service';
import { MazaiInjectionPopoverComponent } from '../mazai-injection-popover/mazai-injection-popover.component';

@Component({
  selector: 'app-mazai-showcase',
  templateUrl: './mazai-showcase.component.html',
  styleUrls: ['./mazai-showcase.component.scss'],
})
export class MazaiShowcaseComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  //今日接種した魔剤の本数
  _todayMazaiInjectionCount: number;
  readonly mazaiInjectionCountObserver: Observable<number>;

  //今日接種した魔剤リスト
  _todayMazaiInjectionList: MazaiData[];
  readonly mazaiInjectionListObserver: Observable<MazaiData[]>;

  constructor(private popoverController: PopoverController,
    private injectionReportService: MazaiInjectionVariableReportService,) {
    this._todayMazaiInjectionCount = 0;
    this.mazaiInjectionCountObserver = this.injectionReportService.MazaiInjectionCountObserver;
    this.mazaiInjectionCountObserver.pipe(takeUntil(this.destroy$)).subscribe(count => { this._todayMazaiInjectionCount = count; });

    this._todayMazaiInjectionList = [];
    this.mazaiInjectionListObserver = this.injectionReportService.MazaiInjectionListObserver;
    this.mazaiInjectionListObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._todayMazaiInjectionList = list; });
  }

  async ngOnInit() {
    await this.refreshData();
  }

  async ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * データを再取得する
   */
  public async refreshData() {
    await this.injectionReportService.fetchMazaiInjectionCount();
    await this.injectionReportService.fetchMazaiInjectionList();
  }

  /**
   * 魔剤のサムネクリック時
   * @param e 
   */
  async onClickMazaiThumbnail(e: Event, m: MazaiData, r: MazaiInjectionRecordData) {
    const popover: HTMLIonPopoverElement = await this.popoverController.create({
      event: e,
      component: MazaiInjectionPopoverComponent,
      componentProps: {
        mazai: m, record: r, onClickDelete: () => {
          popover.dismiss();
        },
      },
    });

    await popover.present();
  }

}