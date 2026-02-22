import { Application } from '../ViewModel/Application.js';
export class Action {
    constructor() {
        this.dataStorage = {};
    }
    static createAndApply(template) {
        let action = Action.from(template);
        Application.registerAction(action);
        action.apply();
        return action;
    }
    static from(args) {
        if (!args.dataStorage) {
            args.dataStorage = {};
        }
        return args;
    }
}
//# sourceMappingURL=Action.js.map