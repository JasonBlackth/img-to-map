import { Showable } from './Showable.js';
import { Action } from '../Model/Action.js';
export class EditorViewModel extends Showable {
    constructor(editorView, editorModel) {
        super(editorView, editorView);
        this.buttonMap = new Map();
        this.editorView = editorView;
        this.editorModel = editorModel;
    }
    getEditor() {
        return this.editorModel;
    }
}
//# sourceMappingURL=EditorViewModel.js.map