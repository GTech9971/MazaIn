import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'mazain-card-plus',
  templateUrl: './mazain-card-plus.component.html',
  styleUrls: ['./mazain-card-plus.component.scss'],
})
export class MazainCardPlusComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  inputForm = this.formBuilder.group<RegistryForm>({
    name: new FormControl('', { nonNullable: true }),
    coffeIn: new FormControl(0, { nonNullable: true }),
    sugar: new FormControl(0, { nonNullable: true }),
    kcal: new FormControl(0, { nonNullable: true }),
    imgData: new FormControl('', { nonNullable: true })
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() { }


  async onClickCancelBtn() {
    await this.modal.dismiss();
  }

  /**
   * 登録ボタン押下時
   */
  async onClickRegistryBtn() {

  }

}


interface RegistryForm {
  name: FormControl<string>;
  coffeIn: FormControl<number>;
  sugar: FormControl<number>;
  kcal: FormControl<number>;
  imgData: FormControl<string>;
}