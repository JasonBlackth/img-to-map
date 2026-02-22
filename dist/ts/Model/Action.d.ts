import type { ActionType } from './ActionType.js';
export declare abstract class Action implements ActionType {
    dataStorage: object;
    abstract apply(data?: object): void;
    abstract revert(data?: object): void;
    static createAndApply(template: ActionType): Action;
    private static from;
}
//# sourceMappingURL=Action.d.ts.map