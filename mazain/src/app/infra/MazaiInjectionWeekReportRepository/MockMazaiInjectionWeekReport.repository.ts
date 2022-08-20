import { Injectable } from "@angular/core";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiRationData } from "src/app/domain/models/MazaiRation.data";
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
        let targetList: MazaiData[] = [];
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

    async getRangeMazaiRationList(startDate: number, endDate: number): Promise<MazaiRationData[]> {
        let rationList: MazaiRationData[] = [];
        let targetList: MazaiData[] = [];
        this.mazaiRepository.mazaiList.forEach(m => {
            const jsonStr: string = JSON.stringify(m);
            let work: MazaiData = JSON.parse(jsonStr);
            work.MazaiInjectionDataList = work.MazaiInjectionDataList.filter(record => {
                return (record.InjecionDateTime <= endDate && record.InjecionDateTime >= startDate);
            });
            if (work.MazaiInjectionDataList.length > 0) {
                targetList.push(work);
            }
        });

        targetList.forEach(m => {
            rationList.push({ MazaiName: m.MazaiName, InjectionCount: m.MazaiInjectionDataList.length });
        });

        return rationList;
    }

}