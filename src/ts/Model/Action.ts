import { Application } from '../ViewModel/Application.js';
import type { ActionType } from './ActionType.js';

export abstract class Action implements ActionType {
    public dataStorage: object = {};

    abstract apply(data?: object): void;
    abstract revert(data?: object): void;

    static createAndApply(template: ActionType): Action {
        let action = Action.from(template);
        Application.registerAction(action);
        action.apply();
        return action;
    }

    private static from(args:ActionType) : Action{
        if (!args.dataStorage){
            args.dataStorage = {};
        }
        return args as Action;
    }
}
