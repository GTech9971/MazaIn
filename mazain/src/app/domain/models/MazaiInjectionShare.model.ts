import { ApplicationConst } from "src/app/consts/Application.const";
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
        let text: string = `【今日の魔剤注入状況をシェア】
`;
        this._todayInjectionMazaiList.forEach(m => {
            text += `${m.MazaiName} ${m.MazaiInjectionDataList.length}本注入
`;
        });

        const result: BaseShareData = {
            title: '今日の魔剤注入をシェア',
            text: text,
            url: ApplicationConst.APPLE_STORE_URL,
            dialogTitle: ''
        };

        return result;
    }

}