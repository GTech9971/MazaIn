import { MazaiInjectionHelperRepository } from "src/app/domain/repositories/MazaiInjectionHelper.repository";

export class MockMazaiInjectionHelperRepository extends MazaiInjectionHelperRepository {

    constructor() {
        super();
    }

    getHelpCommentTitle(coffeInInTake: number, sugarInTake: number, kcalInTake: number): string {
        return "カフェイン取りすぎ";
    }

    getHelpComment(coffeInInTake: number, sugarInTake: number, kcalInTake: number): string {
        return "危険なライン これ以上の接種は一日のカフェイン摂取量を上回ります。";
    }

}