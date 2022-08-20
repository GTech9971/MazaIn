import { Injectable } from "@angular/core";
import { EnergyInjectionReportData } from "../models/EnergyInjectionReport.data";
import { MazaiHelpContextData } from "../models/MazaiHelpContext.data";

@Injectable({
    providedIn: 'root'
})
export abstract class MazaiInjectionHelperRepository {

    /**
    * ヘルプコメントタイトルを取得す
    * @param energyReport 魔剤から注入したエナジー
    */
    abstract getHelpContext(energyReport: EnergyInjectionReportData): Promise<MazaiHelpContextData>;

}