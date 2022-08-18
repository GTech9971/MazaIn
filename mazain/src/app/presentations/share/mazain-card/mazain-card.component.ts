import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonPopover, ToastController } from '@ionic/angular';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiService } from 'src/app/domain/services/Mazai.service';
import { MazaiImageService } from 'src/app/domain/services/MazaiImage.service';

@Component({
  selector: 'mazain-card',
  templateUrl: './mazain-card.component.html',
  styleUrls: ['./mazain-card.component.scss'],
})
export class MazainCardComponent implements OnInit {
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
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,) { }

  ngOnInit() { }


  /**
   * 注入ボタン押下時
   */
  async onClickInjectingBtn() {
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

}
