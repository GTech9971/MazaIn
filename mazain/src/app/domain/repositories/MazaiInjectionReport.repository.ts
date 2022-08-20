import { Injectable } from "@angular/core";
import { EnergyInjectionReportData } from "../models/EnergyInjectionReport.data";
import { MazaiData } from "../models/Mazai.data";
import { MazaiInjectionRecordData } from "../models/MazaiInjectionRecord.data";

@Injectable({
    providedIn: 'root'
})
export abstract class MazaiInjectionReportRepository {

    //サムネ用角度テーブル
    public readonly DEG_TABLE: number[] = [0, 90, 180, 360];

    /**
     * 魔剤画像の角度をランダムに取得する
     * @returns 
     */
    public getRandomImageDeg(): number {
        let rand: number = Math.floor(Math.random() * this.DEG_TABLE.length);
        return this.DEG_TABLE[rand];
    }

    /**
    * 注入レコードから今日接種したかどうか調べる
    * @param injectionRecordList 
    * @returns true:今日接種した, false:今日接種していない
    */
    public containsToday(record: MazaiInjectionRecordData, now: Date): boolean {
        if (!record) { return false; }

        //外部から現在時刻が渡されていたらそちらを使用する
        const NOW: Date = now ? now : new Date();
        const date = new Date(record.InjecionDateTime);
        return NOW.getFullYear() === date.getFullYear() && NOW.getMonth() === date.getMonth() && NOW.getDate() === date.getDate();
    }

    /**
     * 注入リストから今日接種したかどうか調べる
     * @param injectionRecordList 
     * @returns true:今日接種した, false:今日接種していない
     */
    public containsTodayFromArray(injectionRecordList: MazaiInjectionRecordData[]): boolean {
        if (!injectionRecordList) { return false; }
        if (injectionRecordList.length === 0) { return false; }

        const NOW: Date = new Date();
        injectionRecordList.forEach(record => {
            if (this.containsToday(record, NOW)) {
                return true;
            }
        });

        return false;
    }

    /**
     * 今日摂取した魔剤のリストを取得
     */
    abstract getTodayMazaiInjectionList(): Promise<MazaiData[]>;

    /**
     * 今日摂取した魔剤の数を取得
     */
    abstract getTodayMazaiInjectionCount(): Promise<number>;


    /**
     * 今日の魔剤から注入されたエナジーを取得
     */
    abstract getTodayEnergyInjection(): Promise<EnergyInjectionReportData>;


    /**
     * 魔剤注入レコードを生成する
     */
    public createInjectionRecord(): MazaiInjectionRecordData {
        return {
            InjecionDateTime: Date.now(),
            ImageDeg: this.getRandomImageDeg()
        };
    }

    /**
     * 魔剤を注入
     * @param mazai 
     */
    abstract injectionMazai(mazai: MazaiData): Promise<void>;


    /**
     * 最後に接種した魔剤を取得する
     */
    abstract getLatestMazaiInjection(): Promise<MazaiData>;

}