import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonPopover, ToastController } from '@ionic/angular';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiService } from 'src/app/domain/services/Mazai.service';
import { MazaiImageService } from 'src/app/domain/services/MazaiImage.service';
import { MazaiInjectionTodayReportService } from 'src/app/domain/services/MazaiInjectionTodayReport.service';
import { MazaiInputModalComponent } from '../mazai-input-modal/mazai-input-modal.component';

@Component({
  selector: 'mazain-card',
  templateUrl: './mazain-card.component.html',
  styleUrls: ['./mazain-card.component.scss'],
})
export class MazainCardComponent implements OnInit {
  @ViewChild('mazaiInputModal') modal: MazaiInputModalComponent;
  @ViewChild('popver') popver: IonPopover;

  /**
   * 魔剤データ
   */
  @Input() mazai: MazaiData;

  get ImageSrc(): string {
    return this.mazaiImageSercvice.getAvalableImage(this.mazai.MazaiImg);
  }

  constructor(private router: Router,
    private mazaiService: MazaiService,
    private mazaiImageSercvice: MazaiImageService,
    private injectionRecordService: MazaiInjectionTodayReportService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,) { }

  ngOnInit() { }


  /**
   * 注入ボタン押下時
   * 魔剤注入処理
   */
  async onClickInjectingBtn() {
    await this.injectionRecordService.injectionMazai(this.mazai);
    await this.router.navigate(['injecting']);
  }

  /**
   * 削除ボタン押下時
   */
  async onClickDeleteBtn() {
    const DEL: string = "confirm";
    const confirm: HTMLIonAlertElement = await this.alertCtrl.create({
      header: '警告',
      subHeader: `${this.mazai.MazaiName}を削除してもよろしいですか。`,
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
    await this.popver.dismiss();
    //魔剤を削除する
    if (role === DEL) {
      await this.mazaiService.deleteMazai(this.mazai);
      await this.mazaiService.fetchMazaiList();

      const toast: HTMLIonToastElement = await this.toastCtrl.create({ message: `${this.mazai.MazaiName}を削除しました。`, duration: 1500 });
      await toast.present();
    }
  }

  /**
   * 編集ボタン押下
   */
  async onClickEditBtn() {
    await this.modal.present();
    await this.modal.onDidDissmiss();
    await this.popver.dismiss();
  }

}
