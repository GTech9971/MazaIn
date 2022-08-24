import { Injectable } from "@angular/core";
import { addDays } from "date-fns";
import { ApplicationConst } from "src/app/consts/Application.const";
import { EnergyInjectionReportData } from "src/app/domain/models/EnergyInjectionReport.data";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiRationReportData } from "src/app/domain/models/MazaiRationReport.data";
import { MazaiInjectionWeekReportRepository } from "src/app/domain/repositories/MazaiInjectionWeekReport.repository";
import { StorageService } from "src/app/domain/services/Storage.service";
import { DateUtil } from "src/app/utils/Date.util";

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


    /**
     * 週間のエナジー注入リストを返す
     * @param startDate 
     * @param endDate 
     * @returns 
     */
    async getRangeEnergyInjectionList(startDate: number, endDate: number): Promise<EnergyInjectionReportData[]> {
        const enrgyReportList: EnergyInjectionReportData[] = [];
        //指定した期間内に注入した魔剤リストを取得
        const targetList: MazaiData[] = await this.getRangeMazaiInjectionList(startDate, endDate);
        let list: { dateKey: string, mazaiList: MazaiData[] }[] = [];

        //開始日から1日づつ進める
        let workDate: Date = new Date(startDate);
        while (true) {
            const DATE_KEY: string = DateUtil.createDateKey(workDate.getTime());
            if (DATE_KEY === DateUtil.createDateKey(addDays(endDate, 1).getTime())) { break; }

            //日付ごとに注入した記録をフィルターする
            targetList.forEach(m => {
                const jsonStr: string = JSON.stringify(m);
                const work: MazaiData = JSON.parse(jsonStr);
                work.MazaiInjectionDataList = work.MazaiInjectionDataList.filter(record => {
                    return DateUtil.createDateKey(record.InjecionDateTime) === DATE_KEY;
                });

                //注入記録があった場合
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


        //１週間の空のリストを作成
        for (let i = 0; i < 7; i++) {
            const energy: EnergyInjectionReportData = { CoffeInIntake: 0, SugarInTake: 0, KcalInTake: 0 };
            enrgyReportList.push(energy);
        }

        list.forEach(work => {
            const idx: number = DateUtil.getWeekIdx(work.dateKey, startDate, endDate);
            work.mazaiList.forEach(mazai => {
                enrgyReportList[idx].CoffeInIntake += mazai.MzaiCoffeIn * mazai.MazaiInjectionDataList.length;
                enrgyReportList[idx].SugarInTake += mazai.MazaiSugar * mazai.MazaiInjectionDataList.length;
                enrgyReportList[idx].KcalInTake += mazai.MazaiKcal * mazai.MazaiInjectionDataList.length;
            });
        });

        return enrgyReportList;
    }

}