import { Component, Input, OnInit } from '@angular/core';
import { ApplicationConst } from 'src/app/consts/Application.const';
import { EnergyType } from 'src/app/consts/EnergyType.conts';

@Component({
  selector: 'app-mazai-energy-info-popover',
  templateUrl: './mazai-energy-info-popover.component.html',
  styleUrls: ['./mazai-energy-info-popover.component.scss'],
})
export class MazaiEnergyInfoPopoverComponent implements OnInit {

  @Input() energyType: EnergyType

  constructor() {
    this.energyType = EnergyType.CoffeIn;
  }

  get energyInfoText(): string {
    switch (this.energyType) {
      case EnergyType.CoffeIn: {
        return `推奨一日のカフェイン摂取量:${ApplicationConst.RECOMMEND_COFFEIN}mg`;
      } case EnergyType.Sugar: {
        return `推奨一日の糖質摂取量:${ApplicationConst.RECOMMEND_SUGAR}mg`;
      } case EnergyType.Kcal: {
        return `推奨一日のカロリー摂取量:${ApplicationConst.RECOMMEND_KCAL}`;
      }
    }
  }

  ngOnInit() { }

}
