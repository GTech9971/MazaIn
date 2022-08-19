import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { MazaiInjectionHelperRepository } from "../repositories/MazaiInjectionHelper.repository";

@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionHelperService {

    private _helperCommentTitle: string;
    private readonly _helperCommentTitleSubject$: BehaviorSubject<string>;
    readonly HelperCommentTitleObserver: Observable<string>;

    private _helperComment: string;
    private readonly _helperCommentSubject$: BehaviorSubject<string>;
    readonly HelperCommentObserver: Observable<string>;

    constructor(private repository: MazaiInjectionHelperRepository) {
        this._helperCommentTitle = "";
        this._helperCommentTitleSubject$ = new BehaviorSubject<string>("");
        this.HelperCommentTitleObserver = this._helperCommentTitleSubject$.asObservable();

        this._helperComment = "";
        this._helperCommentSubject$ = new BehaviorSubject<string>("");
        this.HelperCommentObserver = this._helperCommentSubject$.asObservable();
    }

    /**
     * ヘルプタイトルコメントを取得する
     * @param coffeInTake 
     * @param sugarInTake 
     * @param kcalInTake 
     */
    public async fetchHelperCommentTitle(coffeInTake: number, sugarInTake: number, kcalInTake: number): Promise<void> {
        this._helperCommentTitle = await this.repository.getHelpCommentTitle(coffeInTake, sugarInTake, kcalInTake);
        this._helperCommentTitleSubject$.next(this._helperCommentTitle);
    }

    /**
     * ヘルパーコメントを取得する
     * @param coffeInTake 
     * @param sugarInTake 
     * @param kcalInTake 
     */
    public async fetchHelperComment(coffeInTake: number, sugarInTake: number, kcalInTake: number): Promise<void> {
        this._helperComment = await this.repository.getHelpComment(coffeInTake, sugarInTake, kcalInTake);
        this._helperCommentSubject$.next(this._helperComment);
    }

}