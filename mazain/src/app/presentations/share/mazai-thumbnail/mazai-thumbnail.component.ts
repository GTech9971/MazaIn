import { Component, Input } from '@angular/core';
import { MazaiData } from 'src/app/domain/models/Mazai.data';
import { MazaiImageService } from 'src/app/domain/services/MazaiImage.service';

@Component({
  selector: 'app-mazai-thumbnail',
  templateUrl: './mazai-thumbnail.component.html',
  styleUrls: ['./mazai-thumbnail.component.scss'],
})
export class MazaiThumbnailComponent {

  /** 魔剤データ */
  @Input() mazai: MazaiData;

  constructor(private mazaiImageService: MazaiImageService) { }

  protected getAvailableImgSrc(mazai: MazaiData): string {
    return this.mazaiImageService.getAvalableImage(mazai.MazaiImg);
  }

}
