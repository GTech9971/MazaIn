import { Injectable } from "@angular/core";
import { EnergyInjectionReportData } from "../models/EnergyInjectionReport.data";
import { MazaiData } from "../models/Mazai.data";
import { MazaiInjectionRecordData } from "../models/MazaiInjectionRecord.data";

@Injectable({
    providedIn: 'root'
})
export abstract class MazaiInjectionBaseReportRepository {
    // //サムネ用角度テーブル
    // public readonly DEG_TABLE: number[] = [0, 90, 180, 360];

    /**
     * 魔剤画像の角度をランダムに取得する
     * 真っ直ぐの方が良いので修正
     * @returns 
     */
    public getRandomImageDeg(): number {
        //let rand: number = Math.floor(Math.random() * this.DEG_TABLE.length);
        //return this.DEG_TABLE[rand];
        return 0;
    }

    /**
    * 注入レコードから今日接種したかどうか調べる
    * @param injectionRecordList 
    * @param targetDate
    * @returns true:接種した, false:接種していない
    */
    public containsDate(targetDate: Date, record: MazaiInjectionRecordData): boolean {
        if (!record) { return false; }

        const date = new Date(record.InjecionDateTime);
        return targetDate.getFullYear() === date.getFullYear() && targetDate.getMonth() === date.getMonth() && targetDate.getDate() === date.getDate();
    }

    /**
     * 注入リストから接種したかどうか調べる
     * @param injectionRecordList 
     * @param targetDate
     * @returns true:接種した, false:接種していない
     */
    public containsDateFromArray(targetDate: Date, injectionRecordList: MazaiInjectionRecordData[]): boolean {
        if (!injectionRecordList) { return false; }
        if (injectionRecordList.length === 0) { return false; }

        injectionRecordList.forEach(record => {
            if (this.containsDate(targetDate, record)) {
                return true;
            }
        });

        return false;
    }

    /**
     * 摂取した魔剤のリストを取得
     */
    abstract getMazaiInjectionList(targetDate: Date): Promise<MazaiData[]>;

    /**
     * 摂取した魔剤の数を取得
     */
    abstract getMazaiInjectionCount(targetDate: Date): Promise<number>;


    /**
     * 魔剤から注入されたエナジーを取得
     */
    abstract getEnergyInjection(targetDate): Promise<EnergyInjectionReportData>;


    /**
     * 魔剤注入レコードを生成する
     */
    public createInjectionRecord(targetDate: Date): MazaiInjectionRecordData {
        return {
            InjecionDateTime: targetDate.getTime(),
            ImageDeg: this.getRandomImageDeg()
        };
    }

    /**
     * 魔剤を注入
     * @param targetDate
     * @param mazai 
     */
    abstract injectionMazai(targetDate: Date, mazai: MazaiData): Promise<void>;

    /**
     * 魔剤注入記録を削除
     * @param mazai 
     * @param record 
     */
    abstract deleteInjectionMazai(mazai: MazaiData, record: MazaiInjectionRecordData): Promise<void>;


    /**
     * 最後に接種した魔剤を取得する
     */
    abstract getLatestMazaiInjection(targetDate: Date): Promise<MazaiData>;
}