//import { makeAction, type Action } from "./Action.js";
import { Colours } from "./ts/Model/Colours.js";

declare let cv: any;

export class Editor {
    public contours: any;
    public selected: number;
    public contourImage: any;
    public rows: number;
    public cols: number;
    public low = 0;
    public high = 0;

    private grayscaleImage: any;
    private contourMap: any;

    public constructor(imageElement: HTMLImageElement) {
        let inputImage = cv.imread(imageElement)
        this.rows = inputImage.rows;
        this.cols = inputImage.cols;
        
        this.grayscaleImage = new cv.Mat();
        cv.cvtColor(inputImage, this.grayscaleImage, cv.COLOR_RGBA2GRAY);
    }

    // public deleteSelectedContour :Action = makeAction(
    //     {
    //         internalState : {
    //            // deletedIndex: this.selected,
    //         },
    //         apply: (state :any) => {
    //             state.deletedIndex = this.selected;
    //             state.deletedCountour = this.deleteSelected();   
    //         },
    //         revert: (state :any) => {

    //         }
    //     }
    // );


    public createContourImage(low :number, high :number) : void {
        this.contourImage = cv.Mat.zeros(this.rows, this.cols, cv.CV_8UC3);
        const canny = cv.Mat.zeros(this.rows, this.cols, cv.CV_8UC1);
        const hierarchy = new cv.Mat();
        this.contours = new cv.MatVector();
        cv.Canny(this.grayscaleImage, canny, low, high);
        cv.findContours(
            canny,
            this.contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE
        );
        cv.drawContours(this.contourImage, this.contours, -1, new cv.Scalar(255, 255, 255), cv.FILLED);
        this.createContourMap();
    }

    private deleteSelected() : any {
        if (!this.selected) return undefined;
        const contourToDelete = this.contours.get(this.selected).clone();
        const replacement = new cv.Mat(
            contourToDelete.rows,
            1,
            cv.CV_32SC2,
            new cv.Scalar(-1)
        );
        cv.drawContours(this.contourImage, this.contours, this.selected, Colours.BLACK, cv.FILLED);
        this.contours.set(this.selected, replacement);
        return contourToDelete;
    }

    public logSelectedContour() : void {
        if (!this.selected) return;
        const contour = this.contours.get(this.selected);
        const area = cv.contourArea(contour, false);
        const rect = cv.boundingRect(contour);
        const rectArea = rect.width * rect.height;
        console.log(rect)

        const hull = new cv.Mat();
        cv.convexHull(contour, hull, false, true);
        const hullArea = cv.contourArea(hull, false);

        console.log(`
            Area: ${area}
            Arc Length: ${cv.arcLength(contour, true)}
            Extent: ${area / rectArea}
            Solidity: ${area / hullArea}`
        );

        hull.delete();
    }

    private createContourMap(){
        this.contourMap = cv.Mat.zeros(this.rows, this.cols, cv.CV_16UC1)
        for (let i = 0; i < this.contours.size(); ++i) {
            cv.drawContours(this.contourMap, this.contours, i, new cv.Scalar(i + 1), cv.FILLED);
        }
    }

    public selectContourClosestTo(clickX :number, clickY :number) : boolean {
        const r = 9;
        const r2 = r * r;
        let closest: { contour_idx: number; sqDist: number } = undefined;

        for (let x = Math.max(clickX - r, 0); x < Math.min(clickX + r, this.contourMap.rows); ++x) {
          for (let y = Math.max(clickY - r, 0); y < Math.min(clickY + r, this.contourMap.cols); ++y) {
            const sqDist = (x - clickX) ** 2 + (y - clickY) ** 2;
            const val = this.contourMap.data16U[y * this.contourMap.cols + x] -1;
            if (sqDist <= r2 && val !== -1) {
                if (!closest || closest.sqDist > sqDist) {
                    closest = { contour_idx: val, sqDist: sqDist };
                }
            }
            }
        }
        if (closest) this.selected = closest.contour_idx;
        return Boolean(closest);
    }

}


