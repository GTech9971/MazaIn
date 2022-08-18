import { Injectable } from "@angular/core";
import { MazaiData } from "../models/Mazai.data";

@Injectable({
    providedIn: 'root'
})
export abstract class MazaiRepository {

    abstract fetchMazaiList(): Promise<MazaiData[]>;

    abstract registryMazai(mazai: MazaiData): Promise<void>;

    abstract updateMazai(mazai: MazaiData): Promise<void>;

    abstract deleteMazai(mazai: MazaiData): Promise<void>;

    abstract generateUUID(): string;

    abstract fetchTemplateMazaiList(): Promise<MazaiData[]>;
}