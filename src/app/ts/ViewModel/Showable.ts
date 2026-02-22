export abstract class Showable {
    protected outputTarget: HTMLElement;
    protected outputContent: HTMLElement;

    constructor(outputTarget: HTMLElement, outputContent: HTMLElement) {
        this.outputTarget = outputTarget;
        this.outputContent = outputContent;
    }

    show(): void {
        this.outputTarget.hidden = false;
    }

    hide(): void {
        this.outputTarget.hidden = true;
    }

}
