import { Injectable } from "@angular/core";
import { addDays, format } from "date-fns";
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
            if (key.includes(ApplicationConst.MAZAI_KEY)) {
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
            rationList.push({ MazaiName: m.MazaiName, MazaiGraphColor: m.MazaiImg.MazaiGraphColor, InjectionCount: m.MazaiInjectionDataList.length })
        });
        return rationList;
    }

    private createDateKey(date: number): string {
        return format(date, 'yyyy-MM-dd');
    }

    async getRangeEnergyInjectionList(startDate: number, endDate: number): Promise<EnergyInjectionReportData[]> {
        const enrgyReportList: EnergyInjectionReportData[] = [];
        const targetList: MazaiData[] = await this.getRangeMazaiInjectionList(startDate, endDate);
        let list: { dateKey: string, mazaiList: MazaiData[] }[] = [];

        let workDate: Date = new Date(startDate);
        while (true) {
            const DATE_KEY: string = this.createDateKey(workDate.getTime());
            if (DATE_KEY === this.createDateKey(addDays(endDate, 1).getTime())) { break; }

            targetList.forEach(m => {
                const jsonStr: string = JSON.stringify(m);
                const work: MazaiData = JSON.parse(jsonStr);
                work.MazaiInjectionDataList = work.MazaiInjectionDataList.filter(record => {
                    console.log("INJ:" + this.createDateKey(record.InjecionDateTime));
                    console.log("KEY:" + DATE_KEY);
                    return this.createDateKey(record.InjecionDateTime) === DATE_KEY;
                });

                if (work.MazaiInjectionDataList.length > 0) {
                    const idx: number = list.findIndex(itm => { return itm.dateKey === DATE_KEY });
                    if (idx === -1) {
                        list.push({ dateKey: DATE_KEY, mazaiList: Array.of(work) });
                    } else {
                        list[idx].mazaiList.push(work);
                    }
                }
            });

            workDate = addDays(workDate, 1);
        }

        console.log(list);

        // TODO listまではあっているが、list foreachだと上からデータが入ってしまう。返り値に日付データもキーで必要
        list.forEach(work => {
            const energy: EnergyInjectionReportData = { CoffeInIntake: 0, SugarInTake: 0, KcalInTake: 0 };
            work.mazaiList.forEach(mazai => {
                energy.CoffeInIntake += mazai.MzaiCoffeIn * mazai.MazaiInjectionDataList.length;
                energy.SugarInTake += mazai.MazaiSugar * mazai.MazaiInjectionDataList.length;
                energy.KcalInTake += mazai.MazaiKcal * mazai.MazaiInjectionDataList.length;
            });
            enrgyReportList.push(energy);
        });

        return enrgyReportList;
    }

}