import { addDays, format } from "date-fns";

export class DateUtil {
    private constructor() { }

    public static createDateKey(date: number | Date): string {
        return format(date, 'yyyy-MM-dd');
    }

    public static getWeekIdx(dateKey: string, start: number | Date, end: number | Date): number {
        let work: Date = new Date(start);
        let count: number = 0;
        while (true) {
            const DATE_KEY: string = this.createDateKey(work);
            if (DATE_KEY === dateKey) { return count; }

            work = addDays(work, 1);
            count++;
        }

        throw "out of date";
    }
}