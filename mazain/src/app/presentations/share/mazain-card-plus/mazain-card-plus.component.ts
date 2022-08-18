import { Component, ViewChild } from '@angular/core';
import { MazaiInputModalComponent } from '../mazai-input-modal/mazai-input-modal.component';

@Component({
  selector: 'mazain-card-plus',
  templateUrl: './mazain-card-plus.component.html',
  styleUrls: ['./mazain-card-plus.component.scss'],
})
export class MazainCardPlusComponent {
  @ViewChild('mazaiInputModal') modal: MazaiInputModalComponent;

  constructor() { }

  /**
   * 魔剤入力モーダルを開く
   */
  async onClickRegistryModalBtn() {
    await this.modal.present();
  }

}