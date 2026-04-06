import type { ActionType } from './ActionType.js';

export abstract class Action<T> implements ActionType<T> {
    public dataStorage: T = {} as T;

    abstract apply(): void;
    abstract revert(): void;

    static createAndApply<T>(template: ActionType<T>): Action<T> {
        const action = Action.from(template);
        window.ActiveProject.registerAction(action);
        action.apply();
        return action;
    }

    private static from<T>(args: ActionType<T>) : Action<T>{
        const dataStorage = args.dataStorage ? args.dataStorage : {} as T;
        let apply, revert;
        if (args.apply.length > 0) {
            apply = function () { args.apply(dataStorage); };
        }
        else {
            apply = args.apply;
        }
        if (args.revert.length > 0) {
            revert = function () { args.revert(dataStorage); };
        } else {
            revert = args.revert;
        }
        return {dataStorage, apply, revert} as Action<T>;
    }
}
