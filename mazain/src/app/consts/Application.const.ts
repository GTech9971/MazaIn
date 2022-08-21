import { MazaiData } from "../domain/models/Mazai.data";

export class ApplicationConst {
    public static readonly MAZAI_KEY: string = "MAZAI";
    public static getMazaiStorageKey(mazai: MazaiData): string { return `${this.MAZAI_KEY}-${mazai.MazaiId}`; }


    public static readonly HELPER_KEY: string = "HELPER";

    public static readonly DEFAULT_IMG: string = "/assets/samples/default.svg";


    public static readonly PRVACY_POLICY_URL: string = "";
}