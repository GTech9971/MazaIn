/**
 * 魔剤画像データ
 */
export interface MazaiImgData {
    /** 魔剤画像URL */
    ImageUrl: string;
    /** 魔剤画像データ */
    ImageDateSmall: string;
    /** 魔剤画像データ中 */
    ImageDataMedium: string;
    /** 魔剤画像データ大 */
    ImageDataLarge: string;


    /** 魔剤割合グラフで使用する魔剤の色 */
    MazaiGraphColor: string;
}