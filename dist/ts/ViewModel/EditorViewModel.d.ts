import { Showable } from './Showable.js';
import type { Initializable } from './Initializable.js';
import type { Editor } from '../Model/Editor.js';
import { Action } from '../Model/Action.js';
export declare abstract class EditorViewModel extends Showable implements Initializable {
    protected editorView: HTMLElement;
    protected editorModel: Editor;
    protected buttonMap: Map<HTMLElement, Action>;
    constructor(editorView: HTMLElement, editorModel: Editor);
    abstract initialize(): void;
    getEditor(): Editor;
}
//# sourceMappingURL=EditorViewModel.d.ts.map