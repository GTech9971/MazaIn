import { Injectable } from "@angular/core";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiRepository } from "src/app/domain/repositories/Mazai.repository";

@Injectable({
    providedIn: 'root'
})
export class MockMazaiRepository extends MazaiRepository {

    private uuid: number;
    private mazaiList: MazaiData[];

    constructor() {
        super();
        this.mazaiList = [];
        this.fetchTemplateMazaiList().then(tmps => {
            this.mazaiList.push(tmps[0]);
        });
        this.uuid = 0;
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
                MazaiName: 'モンスターエナジー500ml',
                MzaiCoffeIn: 30,
                MazaiKcal: 100,
                MazaiSugar: 30,
                MazaiImg: {
                    ImageDataLarge: '',
                    ImageDataMedium: '',
                    ImageDateSmall: '',
                    ImageUrl: '../../../../../assets/samples/IMG_0087.PNG',
                },
                MazaiInjectionDataList: []
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
                    ImageUrl: '../../../../../assets/samples/IMG_0088.PNG',
                },
                MazaiInjectionDataList: []
            }
        ]
    }

}