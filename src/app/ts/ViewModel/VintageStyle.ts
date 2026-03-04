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

        
        for (let i = 0; i < dst.rows; ++i){
            for(let j = 0; j < dst.cols; ++j){
                let value = Math.floor((this.perlinNoise(i, j) + this.smallerNoise(i, j)*0.5)*10/2)/10;
                value = Math.min(((value + 0.5) **2) / 2, 1);     
                value = this.perlinNoise(i, j);
                let smallValue = this.smallerNoise2(i, j);  
                value = this.perlinNoise(i, j) + smallValue*0.06;
                

                if (value > 0.75) value = 0.4;
                else if (value > 0.68) value = 0.5;
                else if (value > 0.6) value = 0.55; 
                else if (value > 0.5) value = 0.7;
                else value = 0.75;

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
        // 242, 202, 143
        let value = VintageStyle.noise.perlin2(x *0.0025, y*0.0025); // Adjust frequency as needed
        value = (value + 1) / 2; // Normalize to [0, 1]
        return value;
        value = value + this.smallerNoise(x, y) * 0.1; // Add smaller noise for more texture
        return Math.floor(value * 10 ) / 10;
    }

    private static smallerNoise(x: number, y: number): number {
        let value = VintageStyle.noise.perlin2(x *0.025, y*0.025); // Adjust frequency as needed
        value = (value + 1) / 2; // Normalize to [0, 1]
        
        return Math.floor(value *value * 5) / 5; 
    }

    private static perlinNoise2(x: number, y: number): number {
        let value = VintageStyle.noise2.perlin2(x *0.0025, y*0.0025);
        value = (value + 1) / 2; // Normalize to [0, 1]
        return value + this.smallerNoise2(x, y) * 0.1; 
    }
    private static smallerNoise2(x: number, y: number): number {
        let value = VintageStyle.noise2.perlin2(x *0.025, y*0.025);
        value = (value + 1) / 2;
        return value;
    }

    public static resetSeeds(): void {
        this.seed = Math.random();
        this.seed2 = Math.random();
        this.noise = new Perlin(this.seed);
        this.noise2 = new Perlin(this.seed2);

    }
}