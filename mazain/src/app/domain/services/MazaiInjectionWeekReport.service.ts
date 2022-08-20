import { Injectable } from "@angular/core";
import { addDays } from "date-fns";
import { BehaviorSubject, Observable } from "rxjs";
import { EnergyInjectionReportData } from "../models/EnergyInjectionReport.data";
import { MazaiData } from "../models/Mazai.data";
import { MazaiRationReportData } from "../models/MazaiRationReport.data";
import { MazaiInjectionWeekReportRepository } from "../repositories/MazaiInjectionWeekReport.repository";

@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionWeekReportService {

    //期間内に注入した魔剤のリスト
    private _rangeMazaiInjectionList: MazaiData[] = [];
    private readonly _rangeMazaiInjectionListSubject$: BehaviorSubject<MazaiData[]> = new BehaviorSubject<MazaiData[]>([]);
    readonly RangeMazaiInjectionListObserver: Observable<MazaiData[]> = this._rangeMazaiInjectionListSubject$.asObservable();
    //期間内に注入した魔剤の数のリスト
    private _rangeMazaiInjectionCountList: number[] = [];
    private readonly _rangeMazaiInjectionCountListSubject$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
    readonly RangeMazaiInjectionCountListObserver: Observable<number[]> = this._rangeMazaiInjectionCountListSubject$.asObservable();

    //前の週の期間内に注入した魔剤のリスト
    private _beforeRangeMazaiInjectionList: MazaiData[] = [];
    private readonly _beforeRangeMazaiInjectionListSubject$: BehaviorSubject<MazaiData[]> = new BehaviorSubject<MazaiData[]>([]);
    readonly BeforeRangeMazaiInjectionListObserver: Observable<MazaiData[]> = this._beforeRangeMazaiInjectionListSubject$.asObservable();
    //前の週の期間内に注入した魔剤の数のリスト
    private _beforeRangeMazaiInjectionCountList: number[] = [];
    private readonly _beforeRangeMazaiInjectionCountListSubject$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
    readonly BeforeRangeMazaiInjectionCountListObserver: Observable<number[]> = this._beforeRangeMazaiInjectionCountListSubject$.asObservable();

    //期間内に注入した魔剤の割合リスト
    private _rangeMazaiRationList: MazaiRationReportData[] = [];
    private readonly _rangeMazaiRationListSubject$: BehaviorSubject<MazaiRationReportData[]> = new BehaviorSubject<MazaiRationReportData[]>([]);
    readonly RangeMazaiRationListObserver: Observable<MazaiRationReportData[]> = this._rangeMazaiRationListSubject$.asObservable();

    //期間内に注入した魔剤からのエナジーリスト
    private _rangeEnergyReportList: EnergyInjectionReportData[] = [];
    private readonly _rangeEnergyReportListSubject$: BehaviorSubject<EnergyInjectionReportData[]> = new BehaviorSubject<EnergyInjectionReportData[]>([]);
    readonly RangeEnergyReportListObserver: Observable<EnergyInjectionReportData[]> = this._rangeEnergyReportListSubject$.asObservable();

    constructor(private repository: MazaiInjectionWeekReportRepository) {
    }



    public equalDate(date1: number, date2: number): boolean {
        const DATE1: Date = new Date(date1);
        const DATE1_NUM: number = DATE1.getFullYear() + DATE1.getMonth() + DATE1.getDate();
        const DATE2: Date = new Date(date2);
        const DATE2_NUM: number = DATE2.getFullYear() + DATE2.getMonth() + DATE2.getDate();

        return DATE1_NUM === DATE2_NUM;
    }

    private getInjectionCountByDate(mazai: MazaiData, date: Date): number {
        let injectionCount: number = 0;
        mazai.MazaiInjectionDataList.forEach(record => {
            if (this.equalDate(record.InjecionDateTime, date.getTime())) {
                injectionCount++;
            }
        });
        return injectionCount;
    }

    /**
     * 期間内に注入した魔剤リストを取得
     * @param startDate 
     * @param endDate 
     */
    public async fetchRangeMazaiInjectionList(startDate: number, endDate: number): Promise<void> {
        this._rangeMazaiInjectionList = await this.repository.getRangeMazaiInjectionList(startDate, endDate);
        this._rangeMazaiInjectionListSubject$.next(this._rangeMazaiInjectionList);
    }

    /**
     * 期間内に注入した魔剤リストを取得(前の週用)
     * @param startDate 
     * @param endDate 
    */
    public async fetchBeforeRangeMazaiInjectionList(startDate: number, endDate: number): Promise<void> {
        this._beforeRangeMazaiInjectionList = await this.repository.getRangeMazaiInjectionList(startDate, endDate);
        this._beforeRangeMazaiInjectionListSubject$.next(this._beforeRangeMazaiInjectionList);
    }


    /**
     * 期間内に注入した魔剤の数リストを取得する
     * @param startDate 
     * @param endDate 
     */
    public async fetchRangeMazaiInjectionCountList(startDate: number, endDate: number): Promise<void> {
        await this.fetchRangeMazaiInjectionList(startDate, endDate);

        this._rangeMazaiInjectionCountList = [];
        let workDate: Date = new Date(startDate);
        while (true) {
            if (this.equalDate(workDate.getTime(), addDays(endDate, 1).getTime())) {
                break;
            }

            let injectionSum: number = 0;
            this._rangeMazaiInjectionList.forEach(m => {
                injectionSum += this.getInjectionCountByDate(m, workDate);
            });
            this._rangeMazaiInjectionCountList.push(injectionSum);

            workDate = addDays(workDate, 1);
        }
        this._rangeMazaiInjectionCountListSubject$.next(this._rangeMazaiInjectionCountList);
    }

    /**
    * 期間内に注入した魔剤の数リストを取得する(前の週用)
    * @param startDate 
    * @param endDate 
    */
    public async fetchBeforeRangeMazaiInjectionCountList(startDate: number, endDate: number): Promise<void> {
        await this.fetchBeforeRangeMazaiInjectionList(startDate, endDate);

        this._beforeRangeMazaiInjectionCountList = [];
        let workDate: Date = new Date(startDate);
        while (true) {
            if (this.equalDate(workDate.getTime(), addDays(endDate, 1).getTime())) {
                break;
            }

            let injectionSum: number = 0;
            this._beforeRangeMazaiInjectionList.forEach(m => {
                injectionSum += this.getInjectionCountByDate(m, workDate);
            });
            this._beforeRangeMazaiInjectionCountList.push(injectionSum);

            workDate = addDays(workDate, 1);
        }
        this._beforeRangeMazaiInjectionCountListSubject$.next(this._beforeRangeMazaiInjectionCountList);
    }

    /**
     * 期間内に注入した魔剤の割合リストを取得する
     * @param startDate 
     * @param endDate 
     */
    public async fetchRangeMazaiRationList(startDate: number, endDate: number): Promise<void> {
        this._rangeMazaiRationList = await this.repository.getRangeMazaiRationList(startDate, endDate);
        this._rangeMazaiRationListSubject$.next(this._rangeMazaiRationList);
    }

    /**
     * 期間内に注入した魔剤からのエナジーリストを取得する
     * @param startDate 
     * @param endDate 
     */
    public async fetchRangeEnergyReportList(startDate: number, endDate: number): Promise<void> {
        this._rangeEnergyReportList = await this.repository.getRangeEnergyInjectionList(startDate, endDate);
        this._rangeEnergyReportListSubject$.next(this._rangeEnergyReportList);
    }

}