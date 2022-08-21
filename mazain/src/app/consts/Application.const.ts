import { MazaiData } from "../domain/models/Mazai.data";

export class ApplicationConst {
    public static readonly MAZAI_LIST_KEY: string = "MAZAI-LIST";
    public static getMazaiStorageKey(mazai: MazaiData): string { return `${this.MAZAI_LIST_KEY}-${mazai.MazaiId}`; }


    public static readonly HELPER_KEY: string = "HELPER";

}