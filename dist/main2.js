import { Colours } from "./Colours.js";
import { Editor } from "./Editor.js";
window.Module = {
    async onRuntimeInitialized() {
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML = 'OpenCV.js is ready.';
        }
    }
};
const imageElement = document.getElementById('imageSrc');
const fileInput = document.getElementById('fileInput');
const cannyLowSlider = document.getElementById('cannyLow');
const cannyHighSlider = document.getElementById('cannyHigh');
const canvas2 = document.querySelector('#canvasOutput2');
const outputDiv = document.getElementById("output");
let editor = undefined;
fileInput.addEventListener('change', (e) => {
    const target = e.target;
    if (!target.files || target.files.length === 0)
        return;
    imageElement.src = URL.createObjectURL(target.files[0]);
    Colours.init();
});
imageElement.addEventListener('load', (e) => {
    outputDiv.hidden = false;
    editor = new Editor(imageElement);
    getContourImage();
});
function getContourImage() {
    editor.createContourImage(cannyLowSlider.valueAsNumber, cannyHighSlider.valueAsNumber);
    cv.imshow('canvasOutput2', editor.contourImage);
}
canvas2.addEventListener('click', (event) => {
    const rect = canvas2.getBoundingClientRect();
    const cx = Math.round(event.clientX - rect.left);
    const cy = Math.round(event.clientY - rect.top);
    if (editor.selectContourClosestTo(cx, cy)) {
        const display = editor.contourImage.clone();
        cv.drawContours(display, editor.contours, editor.selected, new cv.Scalar(255, 0, 0), cv.FILLED);
        cv.imshow('canvasOutput2', display);
    }
});
window.getContourImage = getContourImage;
window.logContour = () => editor.logSelectedContour();
window.deleteContour = () => {
    editor.deleteSelectedContour();
    cv.imshow('canvasOutput2', editor.contourImage);
};
addEventListener('keydown', (event) => {
    if (event.key === 'Delete')
        window.deleteContour();
});
//# sourceMappingURL=main2.js.map