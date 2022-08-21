import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConst } from "src/app/consts/Application.const";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiRepository } from "src/app/domain/repositories/Mazai.repository";
import { StorageService } from "src/app/domain/services/Storage.service";
import * as uuid from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class MazaiImplRepository extends MazaiRepository {


    constructor(private storageService: StorageService,
        private client: HttpClient) {
        super();
    }

    async fetchMazaiList(): Promise<MazaiData[]> {
        let mazaiList: MazaiData[] = [];
        await this.storageService.Storage.forEach((val: string, key: string) => {
            if (key.includes(ApplicationConst.MAZAI_KEY)) {
                const work: MazaiData = JSON.parse(val);
                mazaiList.push(work);
            }
        });
        return mazaiList;
    }

    async registryMazai(mazai: MazaiData): Promise<void> {
        mazai.MazaiId = this.generateUUID();
        return await this.storageService.set(ApplicationConst.getMazaiStorageKey(mazai), JSON.stringify(mazai));
    }

    async updateMazai(mazai: MazaiData): Promise<void> {
        const jsonStr: string = await this.storageService.get(ApplicationConst.getMazaiStorageKey(mazai));
        const target: MazaiData = JSON.parse(jsonStr);
        target.MazaiName = mazai.MazaiName;
        target.MzaiCoffeIn = mazai.MzaiCoffeIn;
        target.MazaiSugar = mazai.MazaiSugar;
        target.MazaiKcal = mazai.MazaiKcal;
        target.MazaiImg = mazai.MazaiImg;
        return await this.storageService.set(ApplicationConst.getMazaiStorageKey(mazai), JSON.stringify(target));
    }

    async deleteMazai(mazai: MazaiData): Promise<void> {
        return await this.storageService.remove(ApplicationConst.getMazaiStorageKey(mazai));
    }

    generateUUID(): string { return uuid.v4(); }

    async fetchTemplateMazaiList(): Promise<MazaiData[]> {
        return new Promise((resolve) => {
            this.client.get<MazaiData[]>("./assets/template/template.json").subscribe(list => {
                resolve(list);
            });
        });
    }

}