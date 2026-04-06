export interface ActionType<T> {
    dataStorage?: T;
    apply(data?: T): void;
    revert(data?: T): void;
}
