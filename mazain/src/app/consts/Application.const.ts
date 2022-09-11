import { MazaiData } from "../domain/models/Mazai.data";

export class ApplicationConst {
    public static readonly MAZAI_KEY: string = "MAZAI";
    public static getMazaiStorageKey(mazai: MazaiData): string { return `${this.MAZAI_KEY}-${mazai.MazaiId}`; }


    public static readonly HELPER_KEY: string = "HELPER";

    /** プライバシーポリシーURL */
    public static readonly PRVACY_POLICY_URL: string = "https://nukomabo.work/post-1379/";

    /** Apple Store URL */
    public static readonly APPLE_STORE_URL: string = "https://apps.apple.com/jp/app/mazain/id1642061728";

    /** 推奨一日のカフェイン摂取量 */
    public static readonly RECOMMEND_COFFEIN: number = 400 + 100;
    /** 推奨一日の糖質摂取量 (男性：３３０、女性：２７０)*/
    public static readonly RECOMMEND_SUGAR: number = 330 + 100;
    /** 推奨一日のカロリー摂取量（女性１４００〜２０００、男子２０００〜２４００） */
    public static readonly RECOMMEND_KCAL: number = 2400 + 100;

}