import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export abstract class MazaiInjectionHelperRepository {

    /**
    * ヘルプコメントタイトルを取得する
    * @param coffeInInTake カフェイン総量
    * @param sugarInTake 糖質総量
    * @param kcalInTake カロリー総量
    */
    abstract getHelpCommentTitle(coffeInInTake: number, sugarInTake: number, kcalInTake: number): string;

    /**
     * ヘルプコメントを取得する
     * @param coffeInInTake カフェイン総量
     * @param sugarInTake 糖質総量
     * @param kcalInTake カロリー総量
     */
    abstract getHelpComment(coffeInInTake: number, sugarInTake: number, kcalInTake: number): string;

}