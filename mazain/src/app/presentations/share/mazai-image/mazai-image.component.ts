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
  * 魔剤データ
  */
  @Input() mazai: MazaiData;

  get ImageSrc(): string {
    return this.mazaiImageSercvice.getAvalableImage(this.mazai.MazaiImg);
  }

  constructor(private mazaiImageSercvice: MazaiImageService,) { }

  ngOnInit() { }

}
