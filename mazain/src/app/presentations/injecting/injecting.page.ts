import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-injecting',
  templateUrl: './injecting.page.html',
  styleUrls: ['./injecting.page.scss'],
})
export class InjectingPage implements OnInit, OnDestroy {

  processValue: number;

  /** 魔剤摂取の値 */
  readonly meterObjList: MeterData[];
  randomIndex: number;
  /** 今回表示させるデータ */
  get activeMeterObj(): MeterData { return this.meterObjList[this.randomIndex]; }

  /**　画面に表示させる値 */
  meterValue: number;

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(private router: Router,
    private activeRouter: ActivatedRoute,
    private alertCtrl: AlertController) {
    this.processValue = 0;
    this.meterValue = 0;
    this.meterObjList = [];
    this.meterObjList.push({ value: 0, label: 'カフェイン', unit: 'mg' });
    this.meterObjList.push({ value: 0, label: '糖質', unit: 'mg' });
    this.meterObjList.push({ value: 0, label: 'カロリー', unit: 'kcal' });
  }

  async ngOnInit() {
    this.activeRouter.queryParams.pipe(takeUntil(this.destroy$)).subscribe(async params => {
      this.meterObjList[0].value = Number.parseInt(params?.coffein);
      this.meterObjList[1].value = Number.parseInt(params?.sugar);
      this.meterObjList[2].value = Number.parseInt(params?.kcal);
    });
    //どのデータを表示させるかはランダム
    this.randomIndex = Math.floor(Math.random() * this.meterObjList.length);

    this.processValue = 0;
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
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async setPercentBar(i: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const apc: number = (i / 100);
        this.processValue = apc;
        this.meterValue = Math.round(this.meterObjList[this.randomIndex].value * (1 - apc));
        resolve();
      }, i * 0.5);
    });
  }

}

/**
 * メーターデータ
 */
interface MeterData {
  /** 何かしらの魔剤の摂取量 */
  value: number;
  /** 摂取のラベル(例：カフェイン、糖質) */
  label: string;
  /** 単位 */
  unit: 'mg' | 'kcal';
}