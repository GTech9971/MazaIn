import { BaseShareData } from "./BaseShare.data";
import { MazaiData } from "./Mazai.data";
import { MazaiShareModel } from "./MazaiShare.model";

/**
 * 魔剤注入Shareモデル
 */
export class MazaiInjectionShareModel extends MazaiShareModel {

    /**
     * 今日注入した魔剤リスト
     */
    private readonly _todayInjectionMazaiList: MazaiData[];

    constructor(todayInjecionMazaiList: MazaiData[]) {
        super();
        this._todayInjectionMazaiList = todayInjecionMazaiList;
    }


    convertShareData(): BaseShareData {
        let text: string = `今日の魔剤注入状況をシェア`;
        this._todayInjectionMazaiList.forEach(m => {
            text += `${m.MazaiName} ${m.MazaiInjectionDataList.length}本注入¥n`;
            text += ", ";
        });
        //最後の,を取り除く
        if (text.length > 0) {
            text = text.substring(0, text.length - 2);
        }

        const result: BaseShareData = {
            title: '#今日の魔剤',
            text: text,
            url: 'https://apps.apple.com/jp/app/mazain/id1642061728',
            dialogTitle: ''
        };

        return result;
    }

}