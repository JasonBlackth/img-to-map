import type { Initializable } from './Initializable.js';
import { Action } from '../Model/Action.js';
import { Editor1ViewModel } from './Editor1ViewModel.js';
import { Editor2ViewModel } from './Editor2ViewModel.js';
import { Editor3ViewModel } from './Editor3ViewModel.js';
export declare class Application implements Initializable {
    private static actionHistory;
    private static undoneActions;
    static editor1View: Editor1ViewModel;
    static editor2View: Editor2ViewModel;
    static editor3View: Editor3ViewModel;
    private static imageUploader;
    private static imageDownloadWindow;
    initialize(): void;
    static initialize(): void;
    static createEditors(): void;
    static undo(): void;
    static redo(): void;
    static registerAction(action: Action): void;
}
//# sourceMappingURL=Application.d.ts.map