import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-injecting',
  templateUrl: './injecting.page.html',
  styleUrls: ['./injecting.page.scss'],
})
export class InjectingPage implements OnInit, OnDestroy {

  processValue: number;

  constructor(private router: Router,
    private alertCtrl: AlertController) {
    this.processValue = 0;
  }

  async ngOnInit() {
    for (let i = 0; i <= 100; i++) {
      await this.setPercentBar(i);
    }
    await this.router.navigate(['tab/detail'], { queryParams: { injection: true } });
  }


  async ngOnDestroy() {
    const alert: HTMLIonAlertElement = await this.alertCtrl.create({
      header: '魔剤注入完了',
      message: '魔剤の注入が完了しました'
    });

    await alert.present();
  }

  private async setPercentBar(i: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let apc = (i / 100);
        this.processValue = apc;
        resolve();
      }, i);
    });
  }

}
