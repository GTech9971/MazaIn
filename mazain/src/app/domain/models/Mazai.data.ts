import { MazaiImgData } from "./MazaiImg.data";
import { MazaiInjectionRecordData } from "./MazaiInjectionRecord.data";

export interface MazaiData {
    /** 魔剤ID */
    MazaiId: string;
    /** 魔剤名 */
    MazaiName: string;
    /** カフェイン量 */
    MzaiCoffeIn: number;
    /** 糖質 */
    MazaiSugar: number;
    /** カロリー */
    MazaiKcal: number;

    /** 魔剤画像データ */
    MazaiImg: MazaiImgData;

    /** 魔剤注入データ */
    MazaiInjectionDataList: MazaiInjectionRecordData[];
}