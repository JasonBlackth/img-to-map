import Perlin from "../../../noise/perlin";


export abstract class ImageStyle{
    
    static seed = Math.random();
    static seed2 = Math.random();
    static noise = new Perlin(0.5);       // 0.5 and 0.75 were the
    static noise2 = new Perlin(0.75);     // set seeds respectively
    static contours: any;
    static lastInputImage: any;

    static setInputImage(inputImage: any) {
        ImageStyle.contours = this.findContours(inputImage);
        ImageStyle.lastInputImage = new cv.Mat();
        inputImage.copyTo(ImageStyle.lastInputImage);
    }

    public abstract apply(image: any): any;

    public resetSeedsAndGetImage(): any {
        ImageStyle.seed = Math.random();
        ImageStyle.seed2 = Math.random();
        ImageStyle.noise = new Perlin(ImageStyle.seed);
        ImageStyle.noise2 = new Perlin(ImageStyle.seed2);
        return this.drawWithNewSeeds();
    }

    abstract drawWithNewSeeds(): any;

    getThreshold(value: number): number { return 0; } 

    perlinNoise(x: number, y: number): number {
        let value = ImageStyle.noise.perlin2(x *0.0025, y*0.0025);
        value = (value + 1) / 2;
        return value;
    }

    smallerNoise(x: number, y: number): number {
        let value = ImageStyle.noise2.perlin2(x *0.025, y*0.025);
        value = (value + 1) / 2;
        return value;
    }

    static findContours(image: any): any {
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(image, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        hierarchy.delete();
        return contours;
    }   
    
}
