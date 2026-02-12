import type { Action } from "./Action.js";


export class Application{
    private static actionHistory :Array<Action> = new Array();
    private static undoneActions :Array<Action> = new Array();
    private static redoingAction :boolean = false;

    private static undo(){
        this.actionHistory.pop().revert();
    }
    private static redo(){
        this.redoingAction = true;
        this.undoneActions.pop().apply();
    }
    public static registerAction(action :Action){
        this.actionHistory.push(action);
        if (!this.redoingAction)
            this.undoneActions = new Array();
    }
    public static registerReversion(action :Action){
        this.undoneActions.push(action);
    }
}