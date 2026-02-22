import { Action } from './Action.js';
export class Editor3 {
    constructor(prevEditor) {
        this.inputImage = prevEditor.getImage();
        this.currentImage = this.inputImage.clone();
        this.rows = this.inputImage.rows;
        this.cols = this.inputImage.cols;
    }
    getImage() {
        return this.currentImage;
    }
    createFjords(subImage) {
        throw new Error('Implement');
    }
    createSmallIslands(subImage) {
        throw new Error('Implement');
    }
    evenOutCoastLine(subImage) {
        throw new Error('Implement');
    }
    makeCoastlineUneven(subImage) {
        throw new Error('Implement');
    }
}
//# sourceMappingURL=Editor3.js.map