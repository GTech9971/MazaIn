import { BaseShareData } from "./BaseShare.data";

/**
 * 魔剤シェアモデル
 * 魔剤シェアモデルは全てこのクラスを継承させる
 */
export abstract class MazaiShareModel {

    constructor() { }

    /**
    * 魔剤シェアモデルを基本シェアデータに変換する
    */
    abstract convertShareData(): BaseShareData;
}