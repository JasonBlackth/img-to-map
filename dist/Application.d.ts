import type { Action } from "./Action.js";
export declare class Application {
    private static actionHistory;
    private static undoneActions;
    private static redoingAction;
    private static undo;
    private static redo;
    static registerAction(action: Action): void;
    static registerReversion(action: Action): void;
}
//# sourceMappingURL=Application.d.ts.map