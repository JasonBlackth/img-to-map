import { EditorViewModel } from './EditorViewModel.js';
import { Editor3 } from '../Model/Editor3.js';

export class Editor3ViewModel extends EditorViewModel {
    protected editorModel: Editor3;

    constructor(editorView: HTMLElement, editor: Editor3) {
        super(editorView, editor);
        this.editorModel = editor;
    }

    initialize(): void {
        // Inicializálás
    }
}
