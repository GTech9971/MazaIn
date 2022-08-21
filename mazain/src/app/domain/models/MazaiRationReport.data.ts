/**
 * 魔剤注入割合データ
 */
export interface MazaiRationReportData {
    /** 魔剤名 */
    MazaiName: string;

    /** 割合グラフで使用する色 */
    MazaiGraphColor: string;

    /** 注入回数 */
    InjectionCount: number;
}