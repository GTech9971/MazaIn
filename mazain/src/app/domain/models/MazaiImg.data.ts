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

    /** 画像の傾き */
    ImageDeg: number;
}