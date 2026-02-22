import { EditorViewModel } from './EditorViewModel.js';
import { Editor2 } from '../Model/Editor2.js';
export class Editor2ViewModel extends EditorViewModel {
    constructor(editorView, editor) {
        super(editorView, editor);
        this.editorModel = editor;
    }
    initialize() {
        // Inicializálás
    }
}
//# sourceMappingURL=Editor2ViewModel.js.map