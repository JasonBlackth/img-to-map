import { Editor1 } from '../Model/Editor1.js';
import { Editor2 } from '../Model/Editor2.js';
import { Editor3 } from '../Model/Editor3.js';
import { Editor1ViewModel } from './Editor1ViewModel.js';
import { Editor2ViewModel } from './Editor2ViewModel.js';
import { Editor3ViewModel } from './Editor3ViewModel.js';
import { ImageUploader } from './ImageUploader.js';
import { ImageDownloadWindow } from './ImageDownloadWindow.js';
import { Action } from '../index.js';



export class Application {
    private static actionHistory: Action[] = [];
    private static undoneActions: Action[] = [];
    private static editor1View: Editor1ViewModel;
    private static editor2View: Editor2ViewModel;
    private static editor3View: Editor3ViewModel;
    private static imageUploader: ImageUploader;
    private static imageDownloadWindow: ImageDownloadWindow;

    static initialize(): void {
        this.imageUploader = new ImageUploader(
            document.getElementById('imageSrc') as HTMLImageElement,
            document.getElementById('fileInput') as HTMLInputElement,
            document.getElementById('uploadedImage') as HTMLImageElement
        )
        this.imageUploader.initialize();
        
    }

    static createEditors(inputImage: any): void {
        this.editor1View = new Editor1ViewModel(
            document.getElementById('editor1')!,
            new Editor1(inputImage)
        )
        this.editor1View.initialize();
        this.editor2View = new Editor2ViewModel(
            document.getElementById('editor2')!,
            new Editor2(this.editor1View.getEditor())
        )
        this.editor2View.initialize();
        this.editor3View = new Editor3ViewModel(
            document.getElementById('editor3')!,
            new Editor3(this.editor2View.getEditor())
        )
        this.editor3View.initialize();

        this.imageDownloadWindow = new ImageDownloadWindow(
            document.getElementById('downloadWindow')!,
            document.getElementById('downloadWindowCanvas') as HTMLCanvasElement,
            this.editor3View.getEditor()
        )
        this.imageDownloadWindow.initialize();

        this.imageUploader.hide();
        this.editor1View.show();
        this.editor2View.hide();
        this.editor3View.hide();
        this.imageDownloadWindow.hide();
        inputImage.delete();
    }

    static undo(): void {
        const action = this.actionHistory.pop();
        if (action) {
            action.revert();
            this.undoneActions.push(action);
            console.log("Action undone. Current history length: " + this.actionHistory.length);
        }
    }

    static redo(): void {
        const action = this.undoneActions.pop();
        if (action) {
            action.apply();
            this.actionHistory.push(action);
            console.log("Action redone. Current history length: " + this.actionHistory.length);
        }
    }

    static registerAction(action: Action): void {
        this.actionHistory.push(action);
        this.undoneActions = [];
    }
}
