import { type Action, type ActionType } from "./Action.js";
import { Colours } from "./ts/Model/Colours.js";
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
    //editor.deleteSelectedContour();
    cv.imshow('canvasOutput2', editor.contourImage);
}
addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Delete')
    (window as any).deleteContour();
});

// let testAction = new Action(
//   {
//     isInEffect: false,
//     p: document.getElementById("actionText")
//   },
//   (o) => { 
//     o.p.innerHTML = "Action was perfomed :)"
//     o.isInEffect = true;
//     return o;
//   },
//   (o) => {
//     o.p.innerHTML = "Action was reverted :)"
//     o.isInEffect = false;
//     return o;
//   }
// ); 

let testCounter = 3;

let testCounterWrapper = {
  counter: 0
}

let actionPerformed = false;

let actionTypeTest :ActionType = {
    dataStorage: 1,
    apply: test,
    revert: testRevert
}

function toggleActionText(){
    if (!actionPerformed)
      actionTypeTest.apply();
    else
      actionTypeTest.revert();
    actionPerformed = !actionPerformed;
}




document
    .getElementById("actionTestButton")
    .addEventListener("click", () => {
      toggleActionText();
  });

  function test(){
    console.log("apply");
  }
  function testRevert(){
    console.log("revert")
  }



