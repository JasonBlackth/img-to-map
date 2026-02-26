
export class Colors {
    public static WHITE :any;
    public static BLACK : any;
    public static RED : any;

    public static init() :void {
        let rgb = Colors.rgb;
        Colors.WHITE = rgb(255, 255, 255);
        Colors.BLACK = rgb(0, 0, 0);
        Colors.RED =   rgb(255, 0, 0);
    }

    public static rgb(r:number, g:number, b:number) :any {
        return new cv.Scalar(r, g, b)
    }
    
    
}
