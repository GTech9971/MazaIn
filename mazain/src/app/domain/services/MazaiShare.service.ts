import { Injectable } from "@angular/core";
import { CanShareResult, Share } from '@capacitor/share';
import { BaseShareData } from "../models/BaseShare.data";
import { MazaiShareModel } from "../models/MazaiShare.model";

@Injectable({
    providedIn: 'root'
})
export class MazaiShareService {

    constructor() { }

    /**
     * シェア機能を使用可能かどうか返す
     * @returns 
     */
    public async canUseShare(): Promise<boolean> {
        const canShare: CanShareResult = await Share.canShare();
        return canShare.value;
    }

    /**
     * 何かしらの魔剤情報をシェアする
     * シェア内容は格魔剤シェアモデルが定義する
     * @param mazaiSahre 基本魔剤シェアモデル
     */
    public async shareMazai(mazaiSahre: MazaiShareModel): Promise<void> {
        const shareData: BaseShareData = mazaiSahre.convertShareData();
        await Share.share({
            title: shareData.title,
            text: shareData.text,
            url: shareData.url,
            dialogTitle: shareData.dialogTitle,
        });
    }
}