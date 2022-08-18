import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiImgData } from 'src/app/domain/models/MazaiImg.data';
import { MazaiService } from 'src/app/domain/services/Mazai.service';
import { MazaiImageService } from 'src/app/domain/services/MazaiImage.service';

@Component({
  selector: 'mazain-card-plus',
  templateUrl: './mazain-card-plus.component.html',
  styleUrls: ['./mazain-card-plus.component.scss'],
})
export class MazainCardPlusComponent implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal: IonModal;

  /** 写真アップロードフラグ */
  uploadedPhoto: boolean;

  readonly inputForm = this.formBuilder.group<RegistryForm>({
    name: new FormControl('', [Validators.required, Validators.min(1)]),
    coffeIn: new FormControl(0, [Validators.required, Validators.min(0)]),
    sugar: new FormControl(0, [Validators.required, Validators.min(0)]),
    kcal: new FormControl(0, [Validators.required, Validators.min(0)]),
    image: new FormControl(undefined, [Validators.required]),
  });

  private readonly destroy$: Subject<void> = new Subject<void>();
  private _templateList: MazaiData[];
  readonly templateObserver: Observable<MazaiData[]>;

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
    this.uploadedPhoto = false;
    await this.mazaiService.fetchTemplateList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  async onClickCancelBtn() {
    await this.closeModal();
  }

  /**
   * 入力フォームを初期化してモダールを閉じる
   */
  private async closeModal() {
    this.inputForm.reset();
    this.uploadedPhoto = false;
    await this.modal.dismiss();
  }

  /**
   * テンプレート選択時
   * @param e 
   */
  onSelectTemplate(e) {
    let selectMazai: MazaiData = this._templateList.find(m => { return m.MazaiId === e.detail.value });
    this.inputForm.get('name').setValue(selectMazai.MazaiName);
    this.inputForm.get('coffeIn').setValue(selectMazai.MzaiCoffeIn);
    this.inputForm.get('sugar').setValue(selectMazai.MazaiSugar);
    this.inputForm.get('kcal').setValue(selectMazai.MazaiKcal);
    const image: HTMLImageElement = new Image();
    if (selectMazai.MazaiImg && selectMazai.MazaiImg.ImageUrl) {
      image.src = selectMazai.MazaiImg.ImageUrl;
      this.inputForm.get('image').setValue(image);
      this.uploadedPhoto = true;
    }

    this.inputForm.updateValueAndValidity();
  }

  /**
   * 写真データの設定
   * @param event 
   */
  previewPhoto(event) {
    const reader: FileReader = new FileReader();
    const file = event.target.files[0];
    reader.onload = ((e) => {
      let image: HTMLImageElement = new Image();
      image.src = e.target.result as string;
      this.inputForm.get('image').setValue(image);

      this.uploadedPhoto = true;
    });
    reader.readAsDataURL(file);
  }

  /**
   * 登録ボタン押下時
   */
  async onClickRegistryBtn() {
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
    await this.closeModal();

    await this.router.navigate(['tab/list']);
  }

}


interface RegistryForm {
  name: FormControl<string>;
  coffeIn: FormControl<number>;
  sugar: FormControl<number>;
  kcal: FormControl<number>;
  image: FormControl<HTMLImageElement>
}