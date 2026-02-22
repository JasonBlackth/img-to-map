import { Application } from '../ViewModel/Application.js';
import { Action } from './Action.js';
import { Editor1 } from './Editor1.js';
export class ChangeValueAction extends Action {
    constructor(editor, propertyName, originalValue, newValue) {
        super();
        this.editor = editor;
        this.propertyName = propertyName;
        this.originalValue = originalValue;
        this.newValue = newValue;
    }
    setEditorProperty(to) {
        this.editor[this.propertyName] = to;
        if (this.editor instanceof Editor1) {
            Application.editor1View.propertyChanged(this.propertyName, to);
        }
        // else if (this.editor instanceof Editor2) {
        //     Application.editor2View.propertyChanged(this.propertyName, to);
        // } else if (this.editor instanceof Editor3) {
        //     Application.editor3View.propertyChanged(this.propertyName, to);
        // }
    }
    apply() {
        this.setEditorProperty(this.newValue);
    }
    revert() {
        this.setEditorProperty(this.originalValue);
    }
    static createAndChangeValue(editor, propertyName, newValue) {
        const originalValue = editor[propertyName];
        const action = new ChangeValueAction(editor, propertyName, originalValue, newValue);
        action.apply();
        Application.registerAction(action);
        return action;
    }
}
//# sourceMappingURL=ChangeValueAction.js.map