import { Injectable } from "@angular/core";
import { EnergyInjectionReportData } from "../models/EnergyInjectionReport.data";
import { MazaiData } from "../models/Mazai.data";
import { MazaiRationReportData } from "../models/MazaiRationReport.data";

@Injectable({
    providedIn: 'root'
})
export abstract class MazaiInjectionWeekReportRepository {
    /**
    * 指定した期間に注入した魔剤のリストを取得する
    * @param startDate 
    * @param endDate 
    */
    abstract getRangeMazaiInjectionList(startDate: number, endDate: number): Promise<MazaiData[]>;

    /**
     * 指定した期間に注入した魔剤の割合リストを取得する
     * @param startDate 
     * @param endDate 
     */
    abstract getRangeMazaiRationList(startDate: number, endDate: number): Promise<MazaiRationReportData[]>


    /**
     * 指定した期間に注入した魔剤からのエナジーリストを取得する
     * @param startDate 
     * @param endDate 
     */
    abstract getRangeEnergyInjectionList(startDate: number, endDate: number): Promise<EnergyInjectionReportData[]>;
}