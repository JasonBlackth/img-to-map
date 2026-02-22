import { EditorViewModel } from './EditorViewModel.js';
import { Editor1 } from '../Model/Editor1.js';
import { DenoiseModeEnum } from '../Model/DenoiseModeEnum.js';

export class Editor1ViewModel extends EditorViewModel {
    protected editorModel: Editor1;

    constructor(editorView: HTMLElement, editor: Editor1) {
        super(editorView, editor);
        this.editorModel = editor;
    }

    initialize(): void {
        this.editorView.querySelector('#Contrast')!.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            this.editorModel.setContrast(parseInt(target.value));
            console.log("Contrast changed to " + target.value);
        });

        this.editorView.querySelector('#ContrastCentre')!.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            this.editorModel.setContrastCentre(parseInt(target.value));
            console.log("Contrast Centre changed to " + target.value);
        });

        this.editorView.querySelector('#DenoiseMode')!.addEventListener('change', (event) => {
            const target = event.target as HTMLSelectElement;
            const key = target.value as keyof typeof DenoiseModeEnum;
            this.editorModel.setDenoiseMode(DenoiseModeEnum[key]);
            console.log("Denoise Mode changed to " + key);
        });

    }

    propertyChanged(propertyName: string, to: any): void {
        let id = "";
        switch (propertyName) {
            case '_contrast':
                id = '#Contrast';
                break;
            case '_contrastCentre':
                id = '#ContrastCentre';
                break;
            case '_denoiseMode':
                id = '#DenoiseMode';
                break;
        }
        (this.editorView.querySelector(id) as HTMLSelectElement).value = to;
    
    }

}
