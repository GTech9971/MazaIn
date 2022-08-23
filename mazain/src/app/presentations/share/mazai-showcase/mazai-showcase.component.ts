import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonPopover, ToastController } from '@ionic/angular';
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

  constructor(private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private injectionReportService: MazaiInjectionReportService,) {
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
    const DEL: string = "confirm";
    const confirm: HTMLIonAlertElement = await this.alertCtrl.create({
      header: '警告',
      subHeader: `${mazai.MazaiName}の注入記録を削除してもよろしいですか。`,
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel'
        },
        {
          text: '削除',
          role: 'confirm'
        }
      ]
    });

    await confirm.present();
    const { role } = await confirm.onDidDismiss();
    //魔剤注入記録を削除する
    if (role === DEL) {
      await this.injectionReportService.deleteInjectionMazai(mazai, record);
      await this.refreshData();
      const toast: HTMLIonToastElement = await this.toastCtrl.create({ message: `${mazai.MazaiName}の注入記録を削除しました。`, duration: 1500 });
      await toast.present();
    }

  }
}