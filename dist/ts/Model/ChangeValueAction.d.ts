import { Action } from './Action.js';
import type { Editor } from './Editor.js';
export declare class ChangeValueAction<T> extends Action {
    private editor;
    private propertyName;
    private originalValue;
    private newValue;
    constructor(editor: Editor, propertyName: string, originalValue: T, newValue: T);
    private setEditorProperty;
    apply(): void;
    revert(): void;
    static createAndChangeValue<T>(editor: Editor, propertyName: string, newValue: T): ChangeValueAction<T>;
}
//# sourceMappingURL=ChangeValueAction.d.ts.map