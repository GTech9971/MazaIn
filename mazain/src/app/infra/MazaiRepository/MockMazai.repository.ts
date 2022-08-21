import { Injectable } from "@angular/core";
import { addDays, addWeeks } from "date-fns";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiRepository } from "src/app/domain/repositories/Mazai.repository";

@Injectable({
    providedIn: 'root'
})
export class MockMazaiRepository extends MazaiRepository {

    private uuid: number;
    public mazaiList: MazaiData[];

    constructor() {
        super();
        this.uuid = 0;
        this.mazaiList = [{
            MazaiId: this.generateUUID(),
            MazaiName: 'モンスターエナジー355ml',
            MzaiCoffeIn: 126,
            MazaiKcal: 147,
            MazaiSugar: 38.5,
            MazaiImg: {
                ImageDataLarge: '',
                ImageDataMedium: '',
                ImageDateSmall: '',
                ImageUrl: '/assets/samples/IMG_0087.PNG',
                MazaiGraphColor: '',
            },
            MazaiInjectionDataList: [{
                InjecionDateTime: Date.now(),
                ImageDeg: 0,
            }, {
                InjecionDateTime: Date.now(),
                ImageDeg: 90
            }, {
                InjecionDateTime: addDays(Date.now(), -1).getTime(),
                ImageDeg: 40
            }, //前の週
            {
                InjecionDateTime: addWeeks(Date.now(), -1).getTime(),
                ImageDeg: 0
            }, {
                InjecionDateTime: addWeeks(Date.now(), -1).getTime(),
                ImageDeg: 0
            }, {
                InjecionDateTime: addDays(Date.now(), -9).getTime(),
                ImageDeg: 20,
            }, {
                InjecionDateTime: addDays(Date.now(), -10).getTime(),
                ImageDeg: 20,
            }]
        }, {
            MazaiId: this.generateUUID(),
            MazaiName: 'コカコーラ500ml',
            MzaiCoffeIn: 30,
            MazaiKcal: 100,
            MazaiSugar: 30,
            MazaiImg: {
                ImageDataLarge: '',
                ImageDataMedium: '',
                ImageDateSmall: '',
                ImageUrl: '/assets/samples/IMG_0088.PNG',
                MazaiGraphColor: '',
            },
            MazaiInjectionDataList: [{
                InjecionDateTime: Date.now(),
                ImageDeg: 0,
            }, {
                InjecionDateTime: Date.now(),
                ImageDeg: 90
            },]
        }];
    }


    async fetchMazaiList(): Promise<MazaiData[]> {
        return this.mazaiList;
    }

    async registryMazai(mazai: MazaiData): Promise<void> {
        this.mazaiList.push(mazai);
    }

    async updateMazai(mazai: MazaiData): Promise<void> {
        this.mazaiList.forEach(m => {
            if (m.MazaiId === mazai.MazaiId) {
                m = mazai;
            }
        });
    }

    async deleteMazai(mazai: MazaiData): Promise<void> {
        this.mazaiList = this.mazaiList.filter(m => {
            return m.MazaiId !== mazai.MazaiId;
        });
    }

    generateUUID(): string {
        this.uuid++;
        return this.uuid.toString();
    }

    async fetchTemplateMazaiList(): Promise<MazaiData[]> {
        return [
            {
                MazaiId: this.generateUUID(),
                MazaiName: 'モンスターエナジー355ml',
                MzaiCoffeIn: 126,
                MazaiKcal: 147,
                MazaiSugar: 38.5,
                MazaiImg: {
                    ImageDataLarge: '',
                    ImageDataMedium: '',
                    ImageDateSmall: '',
                    ImageUrl: '/assets/samples/IMG_0087.PNG',
                    MazaiGraphColor: '',
                },
                MazaiInjectionDataList: [{
                    InjecionDateTime: Date.now(),
                    ImageDeg: 0,
                }]
            },
            {
                MazaiId: this.generateUUID(),
                MazaiName: 'コカコーラ500ml',
                MzaiCoffeIn: 30,
                MazaiKcal: 100,
                MazaiSugar: 30,
                MazaiImg: {
                    ImageDataLarge: '',
                    ImageDataMedium: '',
                    ImageDateSmall: '',
                    ImageUrl: '/assets/samples/IMG_0088.PNG',
                    MazaiGraphColor: '',
                },
                MazaiInjectionDataList: []
            }
        ]
    }

}