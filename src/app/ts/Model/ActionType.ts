export interface ActionType {
    dataStorage?: object;
    apply(data?: object): void;
    revert(data?: object): void;
}
