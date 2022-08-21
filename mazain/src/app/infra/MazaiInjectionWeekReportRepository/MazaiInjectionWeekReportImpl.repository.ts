import { Injectable } from "@angular/core";
import { ApplicationConst } from "src/app/consts/Application.const";
import { EnergyInjectionReportData } from "src/app/domain/models/EnergyInjectionReport.data";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiRationReportData } from "src/app/domain/models/MazaiRationReport.data";
import { MazaiInjectionWeekReportRepository } from "src/app/domain/repositories/MazaiInjectionWeekReport.repository";
import { StorageService } from "src/app/domain/services/Storage.service";

@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionWeekReportImplRepository extends MazaiInjectionWeekReportRepository {

    constructor(private storageService: StorageService) {
        super();
    }

    async getRangeMazaiInjectionList(startDate: number, endDate: number): Promise<MazaiData[]> {
        const targetList: MazaiData[] = [];
        await this.storageService.Storage.forEach((val: string, key: string) => {
            if (key.includes(ApplicationConst.MAZAI_LIST_KEY)) {
                const work: MazaiData = JSON.parse(val);
                work.MazaiInjectionDataList = work.MazaiInjectionDataList.filter(record => {
                    return record.InjecionDateTime <= endDate && record.InjecionDateTime >= startDate;
                });

                if (work.MazaiInjectionDataList.length > 0) {
                    targetList.push(work);
                }
            }
        });
        return targetList;
    }

    async getRangeMazaiRationList(startDate: number, endDate: number): Promise<MazaiRationReportData[]> {
        const rationList: MazaiRationReportData[] = [];
        const targetList: MazaiData[] = await this.getRangeMazaiInjectionList(startDate, endDate);
        targetList.forEach(m => {
            rationList.push({ MazaiName: m.MazaiName, InjectionCount: m.MazaiInjectionDataList.length })
        });
        return rationList;
    }

    async getRangeEnergyInjectionList(startDate: number, endDate: number): Promise<EnergyInjectionReportData[]> {
        const enrgyReportList: EnergyInjectionReportData[] = [];
        const targetList: MazaiData[] = await this.getRangeMazaiInjectionList(startDate, endDate);
        targetList.forEach(m => {
            enrgyReportList.push({
                CoffeInIntake: m.MzaiCoffeIn * m.MazaiInjectionDataList.length,
                SugarInTake: m.MazaiSugar * m.MazaiInjectionDataList.length,
                KcalInTake: m.MazaiKcal * m.MazaiInjectionDataList.length
            });
        });

        return enrgyReportList;
    }

}