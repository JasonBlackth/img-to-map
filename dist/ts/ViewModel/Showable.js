export class Showable {
    constructor(outputTarget, outputContent) {
        this.outputTarget = outputTarget;
        this.outputContent = outputContent;
    }
    show() {
        this.outputTarget.hidden = false;
    }
    hide() {
        this.outputTarget.hidden = true;
    }
}
//# sourceMappingURL=Showable.js.map