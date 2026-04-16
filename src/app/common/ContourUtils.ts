export class ContourUtils {

    static findContours(image: any): any {
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(image, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        hierarchy.delete();
        return contours;
    }

}