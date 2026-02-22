import { Showable } from './Showable.js';
import type { Initializable } from './Initializable.js';
import type { Editor } from '../Model/Editor.js';
import { Action } from '../Model/Action.js';

export abstract class EditorViewModel extends Showable implements Initializable {
    protected editorView: HTMLElement;
    protected editorModel: Editor;
    protected buttonMap: Map<HTMLElement, Action> = new Map();

    constructor(editorView: HTMLElement, editorModel: Editor) {
        super(editorView, editorView);
        this.editorView = editorView;
        this.editorModel = editorModel;
    }

    abstract initialize(): void;

    getEditor(): Editor {
        return this.editorModel;
    }
}
