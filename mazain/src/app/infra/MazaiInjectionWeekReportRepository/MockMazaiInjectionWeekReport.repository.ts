import { Injectable } from "@angular/core";
import { EnergyInjectionReportData } from "src/app/domain/models/EnergyInjectionReport.data";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiRationReportData } from "src/app/domain/models/MazaiRationReport.data";
import { MazaiInjectionWeekReportRepository } from "src/app/domain/repositories/MazaiInjectionWeekReport.repository";
import { MockMazaiRepository } from "../MazaiRepository/MockMazai.repository";


@Injectable({
    providedIn: 'root'
})
export class MockMazaiInjectionWeekReportRepository extends MazaiInjectionWeekReportRepository {

    constructor(private mazaiRepository: MockMazaiRepository) {
        super();
    }

    async getRangeMazaiInjectionList(startDate: number, endDate: number): Promise<MazaiData[]> {
        const targetList: MazaiData[] = [];
        this.mazaiRepository.mazaiList.forEach(m => {
            const jsonStr: string = JSON.stringify(m);
            let work: MazaiData = JSON.parse(jsonStr);
            work.MazaiInjectionDataList = work.MazaiInjectionDataList.filter(record => {
                //期間内にあるもののみ
                return (record.InjecionDateTime <= endDate && record.InjecionDateTime >= startDate);
            });
            if (work.MazaiInjectionDataList.length > 0) {
                targetList.push(work);
            }
        });

        return targetList;
    }

    async getRangeMazaiRationList(startDate: number, endDate: number): Promise<MazaiRationReportData[]> {
        const rationList: MazaiRationReportData[] = [];
        const targetList: MazaiData[] = await this.getRangeMazaiInjectionList(startDate, endDate);
        targetList.forEach(m => {
            rationList.push({ MazaiName: m.MazaiName, MazaiGraphColor: m.MazaiImg.MazaiGraphColor, InjectionCount: m.MazaiInjectionDataList.length });
        });

        return rationList;
    }

    async getRangeEnergyInjectionList(startDate: number, endDate: number): Promise<EnergyInjectionReportData[]> {
        const energyReportList: EnergyInjectionReportData[] = [];
        const targetList: MazaiData[] = await this.getRangeMazaiInjectionList(startDate, endDate);

        targetList.forEach(m => {
            energyReportList.push({
                CoffeInIntake: m.MzaiCoffeIn * m.MazaiInjectionDataList.length,
                SugarInTake: m.MazaiSugar * m.MazaiInjectionDataList.length,
                KcalInTake: m.MazaiKcal * m.MazaiInjectionDataList.length
            });
        });

        return energyReportList;
    }

}