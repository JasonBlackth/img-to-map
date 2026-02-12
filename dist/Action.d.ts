export type ActionType = {
    dataStorage?: any;
    apply(arg?: any): void;
    revert(arg?: any): void;
};
export declare class Action {
    private dataStorage;
    apply: (arg?: any) => void;
    revert: (arg?: any) => void;
    static create(from: ActionType): void;
    private constructor();
}
//# sourceMappingURL=Action.d.ts.map