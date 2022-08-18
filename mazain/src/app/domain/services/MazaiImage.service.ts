import { Injectable } from "@angular/core";
import { MazaiImgData } from "../models/MazaiImg.data";

@Injectable({
    providedIn: 'root'
})
export class MazaiImageService {
    // 画像大(タブレット用)
    public readonly BIG_WIDTH: number = 300; //TODO 仮
    public readonly BIG_HEIGHT: number = 600;//TODO 仮
    // 画像中(スマホ用)
    public readonly MID_WIDTH: number = 150;
    public readonly MID_HEIGHT: number = 300;
    // 画像小(サムネ用)
    public readonly SMALL_WIDTH: number = 14;
    public readonly SMALL_HEIGHT: number = 35;

    constructor() { }

    /**
     * 取得可能な画像データを返す
     * 優先順位
     * 1.スマホサイズ
     * 2.タブレットサイズ
     * 3.画像URL
     * 4.サムネサイズ
     * @param mazaiImage 
     * @returns 
     */
    public getAvalableImage(mazaiImage: MazaiImgData): string {
        if (mazaiImage.ImageDataMedium) {
            return mazaiImage.ImageDataMedium;
        }

        if (mazaiImage.ImageDataLarge) {
            return mazaiImage.ImageDataLarge;
        }

        if (mazaiImage.ImageUrl) {
            return mazaiImage.ImageUrl;
        }

        if (mazaiImage.ImageDateSmall) {
            return mazaiImage.ImageDateSmall;
        }

        return undefined;
    }

    /**
     * アプリで使用する画像に変換する
     * @param image 元画像
     * @param imageUrl 画像のURL　からでも良い
     * @returns 
     */
    public createMazaiImage(image: HTMLImageElement, imageUrl: string): MazaiImgData {
        //大
        const base64StrBig: string = this.resizeImageBig(image);
        //中
        const base64StrMed: string = this.resizeImageMed(image);
        //小
        const base64StrSmall: string = this.resizeImageSmall(image);

        let mazaiImage: MazaiImgData = {
            ImageDataLarge: base64StrBig,
            ImageDataMedium: base64StrMed,
            ImageDateSmall: base64StrSmall,
            ImageUrl: imageUrl
        };
        return mazaiImage;
    }


    private resizeImageBig(image: HTMLImageElement): string {
        return this.resizeImage(image, this.BIG_WIDTH, this.BIG_HEIGHT);
    }

    private resizeImageMed(image: HTMLImageElement): string {
        return this.resizeImage(image, this.MID_WIDTH, this.MID_HEIGHT);
    }

    private resizeImageSmall(image: HTMLImageElement): string {
        return this.resizeImage(image, this.SMALL_WIDTH, this.SMALL_HEIGHT);
    }


    private resizeImage(image: HTMLImageElement, resizeWidth: number, resizeHeight: number): string {
        //TODO リサイズがうまくいかない画像が切り取られる
        // if (image.width > image.height) {
        //     // 横長の画像は横のサイズを指定値にあわせる
        //     const ratio: number = image.height / image.width;
        //     resizeHeight = resizeWidth * ratio;
        // } else {
        //     // 縦長の画像は縦のサイズを指定値にあわせる
        //     const ratio = image.width / image.height;
        //     resizeWidth = resizeHeight * ratio;
        // }
        // image.width = resizeWidth;
        // image.height = resizeHeight;

        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL();
    }
}