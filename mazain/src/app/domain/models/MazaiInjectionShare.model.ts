import { ApplicationConst } from "src/app/consts/Application.const";
import { BaseShareData } from "./BaseShare.data";
import { MazaiData } from "./Mazai.data";
import { MazaiShareModel } from "./MazaiShare.model";

/**
 * 魔剤注入Shareモデル
 */
export class MazaiInjectionShareModel extends MazaiShareModel {

    /**
     * 注入した魔剤リスト
     */
    private readonly _injectionMazaiList: MazaiData[];

    /**
     * 日付ラベル
     */
    private readonly _dateLabel: string;

    /**
     * 
     * @param injecionMazaiList 注入した魔剤リスト
     * @param dateLabel 日付ラベル(例：今日)
     */
    constructor(injecionMazaiList: MazaiData[], dateLabel: string) {
        super();
        this._injectionMazaiList = injecionMazaiList;
        this._dateLabel = dateLabel;
    }


    convertShareData(): BaseShareData {
        let text: string = `【${this._dateLabel}の魔剤注入状況をシェア】
`;
        this._injectionMazaiList.forEach(m => {
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