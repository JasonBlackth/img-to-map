import { Colours } from "./Colours.js";
import { Editor } from "./Editor.js";

declare let cv: any;

declare global {
  interface Window {
    Module: any;
  }
}

window.Module = {
  async onRuntimeInitialized() {
    const status = document.getElementById('status');
    if (status) {
      status.innerHTML = 'OpenCV.js is ready.';
    }
  }
};




const imageElement = document.getElementById('imageSrc') as HTMLImageElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const cannyLowSlider = document.getElementById('cannyLow') as HTMLInputElement;
const cannyHighSlider = document.getElementById('cannyHigh') as HTMLInputElement;
const canvas2 = document.querySelector('#canvasOutput2') as HTMLCanvasElement;
const outputDiv = document.getElementById("output") as HTMLDivElement;

let editor :Editor = undefined;

fileInput.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  imageElement.src = URL.createObjectURL(target.files[0]);
  Colours.init();
});
imageElement.addEventListener('load', (e: Event) => {
  outputDiv.hidden = false;
  editor = new Editor(imageElement);
  getContourImage();
})


function getContourImage() {
    editor.createContourImage(
        cannyLowSlider.valueAsNumber,
        cannyHighSlider.valueAsNumber);
    cv.imshow('canvasOutput2', editor.contourImage);
}

canvas2.addEventListener('click', (event: MouseEvent) => {
    const rect = canvas2.getBoundingClientRect();
    const cx = Math.round(event.clientX - rect.left);
    const cy = Math.round(event.clientY - rect.top);

    if (editor.selectContourClosestTo(cx, cy)){
        const display = editor.contourImage.clone();
        cv.drawContours(display, editor.contours, editor.selected, new cv.Scalar(255, 0, 0), cv.FILLED);
        cv.imshow('canvasOutput2', display);
    }
});


(window as any).getContourImage = getContourImage;
(window as any).logContour = () => editor.logSelectedContour();
(window as any).deleteContour = () => {
    editor.deleteSelectedContour();
    cv.imshow('canvasOutput2', editor.contourImage);
}
addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Delete')
    (window as any).deleteContour();
});
