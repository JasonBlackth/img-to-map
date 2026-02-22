import type { ActionType } from './ActionType.js';

export abstract class Action implements ActionType {
    public dataStorage: object = {};

    abstract apply(): void;
    abstract revert(): void;

    static createAndApply(template: ActionType): Action {
        const action = Action.from(template);
        ActiveProject.registerAction(action);
        action.apply();
        return action;
    }

    private static from(args: ActionType) : Action{
        const dataStorage = args.dataStorage || {};
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
        return {dataStorage, apply, revert} as Action;
    }
}
