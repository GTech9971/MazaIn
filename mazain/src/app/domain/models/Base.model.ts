export abstract class BaseModel<T> {

    /** モデルからデータ型に変換する */
    abstract convert2Data(): T;
}