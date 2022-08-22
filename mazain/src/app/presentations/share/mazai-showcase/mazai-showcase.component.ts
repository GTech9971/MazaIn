import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiInjectionRecordData } from 'src/app/domain/models/MazaiInjectionRecord.data';
import { MazaiInjectionReportService } from 'src/app/domain/services/MazaiInjectionReport.service';

@Component({
  selector: 'app-mazai-showcase',
  templateUrl: './mazai-showcase.component.html',
  styleUrls: ['./mazai-showcase.component.scss'],
})
export class MazaiShowcaseComponent implements OnInit, OnDestroy {
  @ViewChild('mazaiPopver') mazaiPopver: IonPopover;

  private readonly destroy$: Subject<void> = new Subject<void>();

  //今日接種した魔剤の本数
  _todayMazaiInjectionCount: number;
  readonly mazaiInjectionCountObserver: Observable<number>;

  //今日接種した魔剤リスト
  _todayMazaiInjectionList: MazaiData[];
  readonly mazaiInjectionListObserver: Observable<MazaiData[]>;

  constructor(private injectionReportService: MazaiInjectionReportService,) {
    this._todayMazaiInjectionCount = 0;
    this.mazaiInjectionCountObserver = this.injectionReportService.TodayMazaiInjectionCountObserver;
    this.mazaiInjectionCountObserver.pipe(takeUntil(this.destroy$)).subscribe(count => { this._todayMazaiInjectionCount = count; });

    this._todayMazaiInjectionList = [];
    this.mazaiInjectionListObserver = this.injectionReportService.TodayMazaiInjectionListObserver;
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
    await this.injectionReportService.fetchTodayMazaiInjectionCount();
    await this.injectionReportService.fetchTodayMazaiInjectionList();
  }

  /**
   * 魔剤のサムネクリック時
   * @param e 
   */
  async onClickMazaiThumbnail(e: Event) {
    this.mazaiPopver.event = e;
    await this.mazaiPopver.present();
  }

  /**
   * 魔剤注入取消
   * @param mazai 
   * @param record
   */
  async onClickDeleteInjevtion(mazai: MazaiData, record: MazaiInjectionRecordData) {
    //TODO confrmで確認ご、注入の取り消し、最fetch
  }
}