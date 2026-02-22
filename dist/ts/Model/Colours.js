export class Colours {
    static init() {
        let rgb = Colours.rgb;
        Colours.WHITE = rgb(255, 255, 255);
        Colours.BLACK = rgb(0, 0, 0);
        Colours.RED = rgb(255, 0, 0);
    }
    static rgb(r, g, b) {
        return new cv.Scalar(r, g, b);
    }
}
//# sourceMappingURL=Colours.js.map