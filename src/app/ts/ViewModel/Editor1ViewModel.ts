import { EditorViewModel } from './EditorViewModel.js';
import { Editor1 } from '../Model/Editor1.js';
import { DenoiseModeEnum } from '../Model/DenoiseModeEnum.js';

export class Editor1ViewModel extends EditorViewModel {
    protected override editorModel: Editor1;

    constructor(editorView: HTMLElement, editor: Editor1) {
        super(editorView, editor);
        this.editorModel = editor;
    }

    initialize(): void {
        this.editorView.innerHTML = `
            <h2>Prepare Image</h2>
            <label for="Contrast">Contrast:</label>
            <input type="range" id="Contrast" name="contrast" min="0" max="255" value="128"/>
            <label for="ContrastCentre">Contrast Centre:</label>
            <input type="range" id="ContrastCentre" name="contrastCentre" min="0" max="255" value="128"/>
            <label for="DenoiseMode">Denoise Mode:</label>
            <select id="DenoiseMode" name="denoiseMode">
                <option value="none">None</option>
                <option value="gaussian">Gaussian</option>
                <option value="median">Median</option>
            </select>
        `;
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
            const modeKey = target.value.toUpperCase() as keyof typeof DenoiseModeEnum;
            this.editorModel.setDenoiseMode(DenoiseModeEnum[modeKey]);
            console.log("Denoise Mode changed to " + target.value);
        });

    }
}
