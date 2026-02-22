import { Action } from '../Model/Action.js';
import { Editor1 } from '../Model/Editor1.js';
import { Editor2 } from '../Model/Editor2.js';
import { Editor3 } from '../Model/Editor3.js';
import { Editor1ViewModel } from './Editor1ViewModel.js';
import { Editor2ViewModel } from './Editor2ViewModel.js';
import { Editor3ViewModel } from './Editor3ViewModel.js';
import { ImageUploader } from './ImageUploader.js';
import { ImageDownloadWindow } from './ImageDownloadWindow.js';
export class Application {
    initialize() {
        Application.initialize();
        // TODO: ez nem tetszik
    }
    static initialize() {
        this.imageUploader = new ImageUploader(document.getElementById('imageSrc'), document.getElementById('fileInput'), document.getElementById('uploadedImage'));
        this.imageUploader.initialize();
    }
    static createEditors() {
        this.editor1View = new Editor1ViewModel(document.getElementById('editor1'), new Editor1(this.imageUploader.getUploadedImageElement()));
        this.editor1View.initialize();
        this.editor2View = new Editor2ViewModel(document.getElementById('editor2'), new Editor2(this.editor1View.getEditor()));
        this.editor2View.initialize();
        this.editor3View = new Editor3ViewModel(document.getElementById('editor3'), new Editor3(this.editor2View.getEditor()));
        this.editor3View.initialize();
        this.imageDownloadWindow = new ImageDownloadWindow(document.getElementById('downloadWindow'), document.getElementById('downloadWindowCanvas'), this.editor3View.getEditor());
        this.imageDownloadWindow.initialize();
        this.imageUploader.hide();
        this.editor1View.show();
        this.editor2View.hide();
        this.editor3View.hide();
        this.imageDownloadWindow.hide();
    }
    static undo() {
        const action = this.actionHistory.pop();
        if (action) {
            action.revert();
            this.undoneActions.push(action);
            console.log("Action undone. Current history length: " + this.actionHistory.length);
        }
    }
    static redo() {
        const action = this.undoneActions.pop();
        if (action) {
            action.apply();
            this.actionHistory.push(action);
            console.log("Action redone. Current history length: " + this.actionHistory.length);
        }
    }
    static registerAction(action) {
        this.actionHistory.push(action);
        this.undoneActions = [];
    }
}
Application.actionHistory = [];
Application.undoneActions = [];
//# sourceMappingURL=Application.js.map