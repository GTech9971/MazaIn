import { Injectable } from "@angular/core";
import { MazaiData } from "../models/Mazai.data";

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
}