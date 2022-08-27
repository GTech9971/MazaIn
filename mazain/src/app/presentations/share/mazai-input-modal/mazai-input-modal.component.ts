import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DefaultImageConst } from 'src/app/consts/DefaultImage.const';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiImgData } from 'src/app/domain/models/MazaiImg.data';
import { MazaiService } from 'src/app/domain/services/Mazai.service';
import { MazaiImageService } from 'src/app/domain/services/MazaiImage.service';

/**
 * 魔剤入力モーダル
 */
@Component({
  selector: 'app-mazai-input-modal',
  templateUrl: './mazai-input-modal.component.html',
  styleUrls: ['./mazai-input-modal.component.scss'],
})
export class MazaiInputModalComponent implements OnInit {
  @ViewChild(IonModal) protected modal: IonModal;
  /** 画像ファイル入力 valueリセット用 */
  @ViewChild('fileInput') fileInput: ElementRef;

  /** 新規追加かどうか */
  @Input() isNew: boolean = true;
  /** 更新対象の魔剤 */
  @Input() updateMazai: MazaiData;

  protected readonly inputForm = this.formBuilder.group<RegistryForm>({
    name: new FormControl('', [Validators.required, Validators.min(1)]),
    coffeIn: new FormControl(0, [Validators.required, Validators.min(0)]),
    sugar: new FormControl(0, [Validators.required, Validators.min(0)]),
    kcal: new FormControl(0, [Validators.required, Validators.min(0)]),
    image: new FormControl(undefined, [Validators.required]),
  });

  private readonly destroy$: Subject<void> = new Subject<void>();
  private _templateList: MazaiData[];
  protected readonly templateObserver: Observable<MazaiData[]>;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private mazaiService: MazaiService,
    private mazaiImageService: MazaiImageService,) {

    this._templateList = [];
    this.templateObserver = this.mazaiService.TemplateObserver$;
    this.templateObserver.pipe(takeUntil(this.destroy$)).subscribe(tempList => {
      this._templateList = tempList;
    });
  }


  async ngOnInit() {
    //編集モードにも関わらず、更新対象の魔剤データがない場合エラー
    if (this.isNew === false && this.updateMazai === undefined) {
      throw "更新対象の魔剤がありません";
    }

    if (this.isNew) {
      await this.mazaiService.fetchTemplateList();
      //デフォルトの画像を設定す
      const img: HTMLImageElement = new Image();
      img.src = DefaultImageConst.DEFAULT_IMG;
      this.inputForm.get('image').setValue(img);
      this.inputForm.updateValueAndValidity();
    } else {
      this.inputForm.get('name').setValue(this.updateMazai.MazaiName);
      this.inputForm.get('coffeIn').setValue(this.updateMazai.MzaiCoffeIn);
      this.inputForm.get('sugar').setValue(this.updateMazai.MazaiSugar);
      this.inputForm.get('kcal').setValue(this.updateMazai.MazaiKcal);
      const img: HTMLImageElement = new Image();
      img.src = this.mazaiImageService.getAvalableImage(this.updateMazai.MazaiImg);
      if (img.src) {
        this.inputForm.get('image').setValue(img);
      }

      this.inputForm.updateValueAndValidity();
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 魔剤入力モーダルを開く
   */
  public async present() {
    await this.ngOnInit();
    await this.modal.present();
  }

  /**
   * 入力フォームを初期化してモダールを閉じる
   */
  public async dismiss() {
    this.inputForm.reset();
    await this.modal.dismiss();
    await this.ngOnDestroy();
  }

  public async onDidDissmiss() {
    return this.modal.onDidDismiss();
  }

  /**
   * キャンセルボタン押下時
   */
  protected async onClickCancelBtn() {
    await this.dismiss();
  }

  /**
   * テンプレート選択時
   * @param e 
   */
  protected onSelectTemplate(e: any) {
    let selectMazai: MazaiData = this._templateList.find(m => { return m.MazaiId === e.detail.value });
    this.inputForm.get('name').setValue(selectMazai.MazaiName);
    this.inputForm.get('coffeIn').setValue(selectMazai.MzaiCoffeIn);
    this.inputForm.get('sugar').setValue(selectMazai.MazaiSugar);
    this.inputForm.get('kcal').setValue(selectMazai.MazaiKcal);
    const image: HTMLImageElement = new Image();
    //画像ファイル入力エレメント初期化
    this.fileInput.nativeElement.value = "";
    image.src = DefaultImageConst.DEFAULT_IMG;
    this.inputForm.get('image').setValue(image);
    this.inputForm.updateValueAndValidity();
  }

  /**
   * 写真データの設定
   * @param event 
   */
  protected async previewPhoto(event): Promise<void> {
    const reader: FileReader = new FileReader();
    //画像を圧縮
    const file: File = await this.mazaiImageService.compressImage(event.target.files[0]);
    reader.onload = ((e) => {
      let image: HTMLImageElement = new Image();
      image.src = e.target.result as string;
      this.inputForm.get('image').setValue(image);
    });
    reader.readAsDataURL(file);
  }

  /**
   * 登録ボタン押下時
   */
  protected async onClickRegistryBtn() {
    const name: string = this.inputForm.get('name').value;
    const coffeIn: number = this.inputForm.get('coffeIn').value;
    const sugar: number = this.inputForm.get('sugar').value;
    const kcal: number = this.inputForm.get('kcal').value;
    const image: HTMLImageElement = this.inputForm.get('image').value;
    const mazaiImage: MazaiImgData = this.mazaiImageService.createMazaiImage(image, "");

    let mazai: MazaiData = {
      MazaiId: '',
      MazaiName: name,
      MzaiCoffeIn: coffeIn,
      MazaiSugar: sugar,
      MazaiKcal: kcal,
      MazaiImg: mazaiImage,
      MazaiInjectionDataList: []
    };

    await this.mazaiService.registryMazai(mazai);
    await this.mazaiService.fetchMazaiList();
    //成功時
    const toast: HTMLIonToastElement = await this.toastCtrl.create({ message: '魔剤を登録しました。', duration: 1500 });
    await toast.present();
    //モーダルを閉じる
    await this.dismiss();

    await this.router.navigate(['tab/list']);
  }


  /**
   * 更新ボタン押下時
   */
  protected async onClickUpdateBtn() {
    const name: string = this.inputForm.get('name').value;
    const coffeIn: number = this.inputForm.get('coffeIn').value;
    const sugar: number = this.inputForm.get('sugar').value;
    const kcal: number = this.inputForm.get('kcal').value;
    const image: HTMLImageElement = this.inputForm.get('image').value;
    const mazaiImage: MazaiImgData = this.mazaiImageService.createMazaiImage(image, "");

    //値更新
    this.updateMazai.MazaiName = name;
    this.updateMazai.MzaiCoffeIn = coffeIn;
    this.updateMazai.MazaiSugar = sugar;
    this.updateMazai.MazaiKcal = kcal;
    this.updateMazai.MazaiImg = mazaiImage;

    await this.mazaiService.updateMazai(this.updateMazai);
    await this.mazaiService.fetchMazaiList();
    //成功時
    const toast: HTMLIonToastElement = await this.toastCtrl.create({ message: '魔剤を更新しました。', duration: 1500 });
    await toast.present();
    //モーダルを閉じる
    await this.dismiss();

    await this.router.navigate(['tab/list']);
  }


  /**
   * 画像をデフォルトに戻す
   */
  onResetImgBtn() {
    //画像ファイル入力エレメント初期化
    this.fileInput.nativeElement.value = "";
    const img: HTMLImageElement = new Image();
    img.src = DefaultImageConst.DEFAULT_IMG;
    this.inputForm.get('image').setValue(img);
    this.inputForm.updateValueAndValidity();
  }

}

interface RegistryForm {
  name: FormControl<string>;
  coffeIn: FormControl<number>;
  sugar: FormControl<number>;
  kcal: FormControl<number>;
  image: FormControl<HTMLImageElement>
}