import { Application } from '../ViewModel/Application.js';
import { Action } from './Action.js';
import type { Editor } from './Editor.js';
import { Editor1 } from './Editor1.js';

export class ChangeValueAction<T> extends Action {
    private editor: Editor;
    private propertyName: string;
    private originalValue: T;
    private newValue: T;

    constructor(editor: Editor, propertyName: string, originalValue: T, newValue: T) {
        super();
        this.editor = editor;
        this.propertyName = propertyName;
        this.originalValue = originalValue;
        this.newValue = newValue;
    }

    private setEditorProperty(to: T): void {
        (this.editor as any)[this.propertyName] = to;
        if (this.editor instanceof Editor1) {
            Application.editor1View.propertyChanged(this.propertyName, to);
        } 
        // else if (this.editor instanceof Editor2) {
        //     Application.editor2View.propertyChanged(this.propertyName, to);
        // } else if (this.editor instanceof Editor3) {
        //     Application.editor3View.propertyChanged(this.propertyName, to);
        // }
    }

    apply(): void {
        this.setEditorProperty(this.newValue);
    }

    revert(): void {
        this.setEditorProperty(this.originalValue);
    }

    static createAndChangeValue<T>(editor: Editor, propertyName: string, newValue: T): ChangeValueAction<T> {
        const originalValue = (editor as any)[propertyName];
        const action = new ChangeValueAction<T>(editor, propertyName, originalValue, newValue);
        action.apply();
        Application.registerAction(action);
        return action;
    }
}
