export class Application {
    static undo() {
        this.actionHistory.pop().revert();
    }
    static redo() {
        this.redoingAction = true;
        this.undoneActions.pop().apply();
    }
    static registerAction(action) {
        this.actionHistory.push(action);
        if (!this.redoingAction)
            this.undoneActions = new Array();
    }
    static registerReversion(action) {
        this.undoneActions.push(action);
    }
}
Application.actionHistory = new Array();
Application.undoneActions = new Array();
Application.redoingAction = false;
//# sourceMappingURL=Application.js.map