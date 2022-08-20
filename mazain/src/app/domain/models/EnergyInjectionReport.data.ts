/**
 * 魔剤から注入したエナジーの総量のレポートデータ
 */
export interface EnergyInjectionReportData {
    /** カフェインの総量 */
    CoffeInIntake: number;
    /** 糖質の総量 */
    SugarInTake: number;
    /** カロリーの総量 */
    KcalInTake: number;
}