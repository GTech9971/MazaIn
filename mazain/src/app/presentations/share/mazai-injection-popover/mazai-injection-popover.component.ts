import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiInjectionRecordData } from 'src/app/domain/models/MazaiInjectionRecord.data';
import { MazaiInjectionVariableReportService } from 'src/app/domain/services/MazaiInjectionVariableReport.service';

@Component({
  selector: 'app-mazai-injection-popover',
  templateUrl: './mazai-injection-popover.component.html',
  styleUrls: ['./mazai-injection-popover.component.scss'],
})
export class MazaiInjectionPopoverComponent implements OnInit {
  @Input("mazai") mazai: MazaiData;
  @Input("record") record: MazaiInjectionRecordData;
  @Input() onClickDelete = () => { }

  constructor(private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private injectionReportService: MazaiInjectionVariableReportService) { }

  ngOnInit() { }

  async onClickDeleteInjevtion() {
    const DEL: string = "confirm";
    const confirm: HTMLIonAlertElement = await this.alertCtrl.create({
      header: '警告',
      subHeader: `${this.mazai.MazaiName}の注入記録を削除してもよろしいですか。`,
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
      await this.injectionReportService.deleteInjectionMazai(this.mazai, this.record);
      await this.injectionReportService.fetchMazaiInjectionCount();
      await this.injectionReportService.fetchMazaiInjectionList();
      const toast: HTMLIonToastElement = await this.toastCtrl.create({ message: `${this.mazai.MazaiName}の注入記録を削除しました。`, duration: 1500 });
      await toast.present();
    }

    this.onClickDelete();
  }

}
