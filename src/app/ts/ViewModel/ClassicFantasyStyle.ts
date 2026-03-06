import { output } from "@angular/core";
import Perlin from "../../../noise/perlin";
import { Colors } from "../Model/Colors";

export class ClassicFantasyStyle{
    private static seed = Math.random();
    private static seed2 = Math.random();    
    private static noise = new Perlin(0.5);       // 0.5 and 0.75 were the
    private static noise2 = new Perlin(0.75);      // set seeds respoectively
    private static thresholds = [0.3, 0.6];
    private static contours: any;



    public static apply(image: any) : any{
        let dst = new cv.Mat();
        image.copyTo(dst);
        
        
        let iters = 1;
        let x = Math.floor(Math.min(image.rows, image.cols)/20)*2 + 1;
        let ksize = new cv.Size(2*x+1,2*x+1);
        let sigma = 2*x;

        this.contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(dst, this.contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        

        for (let i = 0; i < iters; ++i) {
            for (let j = 0; j < this.contours.size(); ++j) {
                let contour = this.contours.get(j);
                let area = cv.contourArea(contour);
                if (area > 200) {
                    cv.drawContours(dst, this.contours, j, Colors.WHITE, 20);
                }
            }
            cv.GaussianBlur(dst, dst, ksize, sigma, sigma, cv.BORDER_DEFAULT);
            cv.addWeighted(image, 1.0, dst, 2.0, 0, dst);
            cv.drawContours(dst, this.contours, -1, Colors.WHITE, 5);
            x = Math.floor(Math.min(image.rows, image.cols)/60)*2 + 1;
            ksize = new cv.Size(x, x);
            cv.GaussianBlur(dst, dst, ksize, x, x, cv.BORDER_DEFAULT);
        }
        let outputImage = cv.Mat.zeros(dst.rows, dst.cols, cv.CV_8UC3);
        

        for (let i = 0; i < dst.rows; ++i) {
            for(let j = 0; j < dst.cols; ++j) {
                if (image.ucharPtr(i, j)[0] !== 0) {
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

    private static perlinNoise(x: number, y: number): number {
        let value = this.noise.perlin2(x *0.0025, y*0.0025);
        value = (value + 1) / 2;
        return value;
    }

    private static smallerNoise(x: number, y: number): number {
        let value = this.noise2.perlin2(x *0.025, y*0.025);
        value = (value + 1) / 2;
        return value;
    }

    private static getThreshold(value: number): number {
        if (value > 0.8) return 0.65;
        else if (value > 0.4) return 0.75;
        else if (value > 0.2) return 0.85; 
        else if (value > 0.1) return 0.95;
        else return 1;
    }

    public static resetSeeds(): void {
        this.seed = Math.random();
        this.seed2 = Math.random();
        this.noise = new Perlin(this.seed);
        this.noise2 = new Perlin(this.seed2);
    }

}
