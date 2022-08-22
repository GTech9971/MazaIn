import { Component, Input, OnInit } from '@angular/core';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiImageService } from 'src/app/domain/services/MazaiImage.service';

@Component({
  selector: 'app-mazai-image',
  templateUrl: './mazai-image.component.html',
  styleUrls: ['./mazai-image.component.scss'],
})
export class MazaiImageComponent implements OnInit {

  /**
  * 魔剤データ 指定した場合優先
  */
  @Input() mazai: MazaiData = undefined;

  /**
   * 魔剤画像ソース
   */
  @Input() imgSrc: string;

  get ImageSrc(): string {
    if (this.mazai !== undefined && this.mazai !== null) {
      return this.mazaiImageSercvice.getAvalableImage(this.mazai.MazaiImg);
    }
    return this.imgSrc;
  }

  constructor(private mazaiImageSercvice: MazaiImageService,) { }

  ngOnInit() { }

}
