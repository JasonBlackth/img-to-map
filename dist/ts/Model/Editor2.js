import { Action } from './Action.js';
import { ChangeValueAction } from './ChangeValueAction.js';
import { Colours } from './Colours.js';
export class Editor2 {
    constructor(prevEditor) {
        this.selectedContour = -1;
        this.lowThreshold = 0;
        this.highThreshold = 255;
        this.declutterThreshold = 0;
        this.inputImage = prevEditor.getImage();
        this.currentImage = this.inputImage.clone();
        this.rows = this.inputImage.rows;
        this.cols = this.inputImage.cols;
        this.contourMap = new cv.Mat();
        this.contourImage = new cv.Mat();
        this.grayscaleImage = new cv.Mat();
        cv.cvtColor(this.inputImage, this.grayscaleImage, cv.COLOR_RGBA2GRAY);
    }
    getImage() {
        return this.currentImage;
    }
    deleteSelectedContour() {
        throw new Error('Implement');
    }
    setLowThreshold(to) {
        return ChangeValueAction.createAndChangeValue(this, "lowThreshold", to);
    }
    setHighThreshold(to) {
        return ChangeValueAction.createAndChangeValue(this, "highThreshold", to);
    }
    setDeclutterThreshold(to) {
        return ChangeValueAction.createAndChangeValue(this, "declutterThreshold", to);
    }
    drawNewContour(input) {
        throw new Error('Implement');
    }
    createContourImage() {
        this.contourImage = cv.Mat.zeros(this.rows, this.cols, cv.CV_8UC3);
        const canny = cv.Mat.zeros(this.rows, this.cols, cv.CV_8UC1);
        const hierarchy = new cv.Mat();
        this.contours = new cv.MatVector();
        cv.Canny(this.grayscaleImage, canny, this.lowThreshold, this.highThreshold);
        cv.findContours(canny, this.contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        cv.drawContours(this.contourImage, this.contours, -1, new Colours.WHITE, cv.FILLED);
        this.createContourMap();
    }
    selectContourClosestTo(clickX, clickY) {
        const r = 9;
        const r2 = r * r;
        let closest = undefined;
        for (let x = Math.max(clickX - r, 0); x < Math.min(clickX + r, this.contourMap.rows); ++x) {
            for (let y = Math.max(clickY - r, 0); y < Math.min(clickY + r, this.contourMap.cols); ++y) {
                const sqDist = (x - clickX) ** 2 + (y - clickY) ** 2;
                const val = this.contourMap.data16U[y * this.contourMap.cols + x] - 1;
                if (sqDist <= r2 && val !== -1) {
                    if (!closest || closest.sqDist > sqDist) {
                        closest = { contour_idx: val, sqDist: sqDist };
                    }
                }
            }
        }
        if (closest)
            this.selectedContour = closest.contour_idx;
        return Boolean(closest);
    }
    createContourMap() {
        this.contourMap = cv.Mat.zeros(this.rows, this.cols, cv.CV_16UC1);
        for (let i = 0; i < this.contours.size(); ++i) {
            cv.drawContours(this.contourMap, this.contours, i, new cv.Scalar(i + 1), cv.FILLED);
        }
    }
    logSelectedContour() {
        if (!this.selectedContour)
            return;
        const contour = this.contours.get(this.selectedContour);
        const area = cv.contourArea(contour, false);
        const rect = cv.boundingRect(contour);
        const rectArea = rect.width * rect.height;
        console.log(rect);
        const hull = new cv.Mat();
        cv.convexHull(contour, hull, false, true);
        const hullArea = cv.contourArea(hull, false);
        console.log(`
            Area: ${area}
            Arc Length: ${cv.arcLength(contour, true)}
            Extent: ${area / rectArea}
            Solidity: ${area / hullArea}`);
        hull.delete();
    }
    deleteSelected() {
        if (!this.selectedContour)
            return undefined;
        const contourToDelete = this.contours.get(this.selectedContour).clone();
        const replacement = new cv.Mat(contourToDelete.rows, 1, cv.CV_32SC2, new cv.Scalar(-1));
        cv.drawContours(this.contourImage, this.contours, this.selectedContour, Colours.BLACK, cv.FILLED);
        this.contours.set(this.selectedContour, replacement);
        return contourToDelete;
    }
}
//# sourceMappingURL=Editor2.js.map