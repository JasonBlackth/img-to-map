
export class Colours {
    public static WHITE :any;
    public static BLACK : any;
    public static RED : any;

    public static init() :void {
        let rgb = Colours.rgb;
        Colours.WHITE = rgb(255, 255, 255);
        Colours.BLACK = rgb(0, 0, 0);
        Colours.RED =   rgb(255, 0, 0);
    }

    public static rgb(r:number, g:number, b:number) :any {
        return new cv.Scalar(r, g, b)
    }
    
    
}
