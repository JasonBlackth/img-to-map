import Perlin from "../../../noise/perlin";
import { Colors } from "../Model/Colors";

export class VintageStyle{
    private static seed = Math.random();
    private static seed2 = Math.random();    
    private static noise = new Perlin(0.5);       // 0.5 and 0.75 were the
    private static noise2 = new Perlin(0.75);      // set seeds respoectively
    private static thresholds = [0.3, 0.6];


    public static apply(image: any) : any{
        console.log(`Image received: ${image}`)
      
        for (let i = 0; i<10; ++i){
            for(let j = 0; j < 10; ++j){
                image.ucharPtr(i,j)[0] = 255;
                image.ucharPtr(i,j)[1] = 0;
                image.ucharPtr(i,j)[2] = 0;
            }
        }


        let src = image;
        let dst = new cv.Mat(src.rows, src.cols, cv.CV_8UC3, Colors.RED);
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(src, src, 120, 255, cv.THRESH_BINARY);
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(
            src,
            contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_NONE
        );

        console.log(new cv.Scalar(255, 0, 0));
        console.log(dst.ucharPtr(0,0));
        let u8 = new Uint8Array([255, 0, 0]);
        
        for (let i = 0; i < dst.rows; ++i){
            for(let j = 0; j < dst.cols; ++j){
                let value = this.perlinNoise(i, j) + this.smallerNoise(i, j)*0.06;
                value = this.getThreshold(value);


                dst.ucharPtr(i,j)[0] = 192 + Math.floor(value * 50);
                dst.ucharPtr(i,j)[1] = 112 + Math.floor(value * 90); 
                dst.ucharPtr(i,j)[2] = 43 + Math.floor(value * 100);
            }
        }
        cv.drawContours(dst, contours, -1, Colors.BLACK, 4, cv.LINE_4);  
        src.delete();
        contours.delete();
        hierarchy.delete();

        return dst;
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
        if (value > 0.75) return 0.4;
        else if (value > 0.68) return 0.5;
        else if (value > 0.6) return 0.6; 
        else if (value > 0.5) return 0.7;
        else return 0.75;
    }

    public static resetSeeds(): void {
        this.seed = Math.random();
        this.seed2 = Math.random();
        this.noise = new Perlin(this.seed);
        this.noise2 = new Perlin(this.seed2);
    }
}