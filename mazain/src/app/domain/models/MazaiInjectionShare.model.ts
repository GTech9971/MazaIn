import { BaseShareData } from "./BaseShare.data";
import { MazaiShareModel } from "./MazaiShare.model";

/**
 * 魔剤注入Shareモデル
 */
export class MazaiInjectionShareModel extends MazaiShareModel {

    //TODO 今日の魔剤注入モデルに必要な情報をコンストラクタで設定する
    constructor() {
        super();
    }


    convertShareData(): BaseShareData {
        throw new Error("Method not implemented.");
    }

}