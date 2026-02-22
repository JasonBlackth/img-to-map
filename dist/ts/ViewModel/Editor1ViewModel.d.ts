import { EditorViewModel } from './EditorViewModel.js';
import { Editor1 } from '../Model/Editor1.js';
export declare class Editor1ViewModel extends EditorViewModel {
    protected editorModel: Editor1;
    constructor(editorView: HTMLElement, editor: Editor1);
    initialize(): void;
    propertyChanged(propertyName: string, to: any): void;
}
//# sourceMappingURL=Editor1ViewModel.d.ts.map