import { EditorViewModel } from './EditorViewModel.js';
import { Editor2 } from '../Model/Editor2.js';

export class Editor2ViewModel extends EditorViewModel {
    protected editorModel: Editor2;

    constructor(editorView: HTMLElement, editor: Editor2) {
        super(editorView, editor);
        this.editorModel = editor;
    }

    initialize(): void {
        // Inicializálás
    }
}
