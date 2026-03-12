import { Colors } from "../Model/Colors";
import { ImageStyle } from "./ImageStyle";

export class ClassicFantasyStyle extends ImageStyle{
    private blurredInputImage: any;


    public override apply(image: any) : any{
        image.copyTo(ImageStyle.lastInputImage);
        this.blurredInputImage = new cv.Mat();
        
        this.calculateSeaDepth();
        return this.getOutputImage();
    }

    override getThreshold(value: number): number {
        if (value > 0.8) return 0.65;
        else if (value > 0.4) return 0.75;
        else if (value > 0.2) return 0.85; 
        else if (value > 0.1) return 0.95;
        else return 1;
    }

    drawWithNewSeeds(): any {
        if (this.blurredInputImage && ImageStyle.lastInputImage) {
           return this.getOutputImage(); 
        }
        throw new Error("No image to draw with ClassicFantasyStyle");
    }


    private calculateSeaDepth(): any {
        let dst = new cv.Mat();
        ImageStyle.lastInputImage.copyTo(dst);


        let x = Math.floor(Math.min(dst.rows, dst.cols)/20)*2 + 1;
        let ksize = new cv.Size(2*x+1,2*x+1);
        let sigma = 2*x;

        ImageStyle.findContours(ImageStyle.lastInputImage);
        for (let j = 0; j < ImageStyle.contours.size(); ++j) {
            let contour = ImageStyle.contours.get(j);
            let area = cv.contourArea(contour);
            if (area > 200) {
                cv.drawContours(dst, ImageStyle.contours, j, Colors.WHITE, 20);
            }
        }
        cv.GaussianBlur(dst, dst, ksize, sigma, sigma, cv.BORDER_DEFAULT);
        cv.addWeighted(ImageStyle.lastInputImage, 1.0, dst, 2.0, 0, dst);
        cv.drawContours(dst, ImageStyle.contours, -1, Colors.WHITE, 5);
        x = Math.floor(Math.min(dst.rows, dst.cols)/60)*2 + 1;
        ksize = new cv.Size(x, x);
        cv.GaussianBlur(dst, dst, ksize, x, x, cv.BORDER_DEFAULT);
        
        
        dst.copyTo(this.blurredInputImage);
        

    }

    private getOutputImage(): any {
        let dst = this.blurredInputImage;
        let outputImage = cv.Mat.zeros(dst.rows, dst.cols, cv.CV_8UC3);
        for (let i = 0; i < dst.rows; ++i) {
            for(let j = 0; j < dst.cols; ++j) {
                if (ImageStyle.lastInputImage.ucharPtr(i, j)[0] !== 0) {
                    outputImage.ucharPtr(i,j)[0] = 3;
                    outputImage.ucharPtr(i,j)[1] = 100; 
                    outputImage.ucharPtr(i,j)[2] = 3;
                } else {
                    let value = (dst.ucharPtr(i,j)[0] / 255) + this.smallerNoise(i, j)*0.1;
                    value = this.getThreshold(value);
                    
                    outputImage.ucharPtr(i,j)[0] = 108 - Math.floor(value * 105);
                    outputImage.ucharPtr(i,j)[1] = 219 - Math.floor(value * 105);
                    outputImage.ucharPtr(i,j)[2] = 253 - Math.floor(value * 105);
                }
            }
        }
        return outputImage;
    }


}
