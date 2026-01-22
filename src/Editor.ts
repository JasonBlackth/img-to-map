declare let cv: any;

export class Editor {
    private image: any;
    private contours: any;
    private selected: number;

    public constructor(imageElement: HTMLImageElement) {
        this.image = cv.imread(imageElement);
        let temp = this.getGrayscaleImage();
        this.image = temp.clone();
    }

    public getGrayscaleImage(): any {
        if (!this.image) throw new Error("Image not loaded");

        let output = new cv.Mat();
        cv.cvtColor(this.image, output, cv.COLOR_RGBA2GRAY);
        return output;
    }

    public getContourImage(low :number, high :number): any {
        if (!this.image) throw new Error("Image not loaded");

        const output = cv.Mat.zeros(this.image.rows, this.image.cols, cv.CV_8UC3);
        const canny = cv.Mat.zeros(output.rows, output.cols, cv.CV_8UC1);
        const hierarchy = new cv.Mat();
        this.contours = new cv.MatVector();
        cv.Canny(this.image, canny, low, high);
        cv.findContours(
            canny,
            this.contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE
        );
        cv.drawContours(output, this.contours, -1, new cv.Scalar(255, 255, 255), cv.FILLED);
        return output;
    }

    public selectContour(index :number): any {
        this.selected = index;
        return this.contours.get(index);
    }

    public deleteSelectedContour() : void {
        const replacement = new cv.Mat(
            this.contours.get(this.selected),
            -1,
            cv.CV_32SC2,
            new cv.Scalar(-1)
        );
        this.contours.set(this.selected, replacement);
    }

}


