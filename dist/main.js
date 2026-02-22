import { Application } from "./ts/ViewModel/Application.js";
window.Module = {
    async onRuntimeInitialized() {
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML = 'OpenCV.js is ready.';
        }
    }
};
Application.initialize();
window.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        if (event.key === 'z') {
            Application.undo();
        }
        if (event.key === 'y') {
            Application.redo();
        }
    }
});
// let contours: any | undefined;
// let inputImage: any | undefined;
// let filled: any | undefined;
// let canny: any | undefined;
// let point_map: any | undefined;
// let point_map_img: any | undefined;
// let cannyChanged = true;
// const imgElement = document.getElementById('imageSrc') as HTMLImageElement;
// const inputElement = document.getElementById('fileInput') as HTMLInputElement;
// const cL_slider = document.getElementById('cannyLow') as HTMLInputElement;
// const cH_slider = document.getElementById('cannyHigh') as HTMLInputElement;
// const cnt_number = document.getElementById('cnt_number') as HTMLInputElement;
// const canvas2 = document.querySelector('#canvasOutput2') as HTMLCanvasElement;
// inputElement.addEventListener('change', (e: Event) => {
//   const target = e.target as HTMLInputElement;
//   if (!target.files || target.files.length === 0) return;
//   imgElement.src = URL.createObjectURL(target.files[0]);
// });
// function clear_canvas(id: string): void {
//   const canvas = document.getElementById(id) as HTMLCanvasElement;
//   const ctx = canvas.getContext('2d');
//   if (!ctx) return;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// }
// function deleteContour(): void {
//   const idx = Number(cnt_number.value);
//   if (!contours || contours.size() <= idx) return;
//   const contour = contours.get(idx);
//   const empty = new cv.Mat(
//     contour.rows,
//     1,
//     cv.CV_32SC2,
//     new cv.Scalar(-1)
//   );
//   contours.set(idx, empty);
//   processImg();
// }
// (window as any).deleteContour = deleteContour;
// (window as any).logContour = logContour;
// addEventListener('keydown', (event: KeyboardEvent) => {
//   if (event.key === 'Delete') deleteContour();
// });
// function logContour(): void {
//   if (!contours) return;
//   const editor = new Editor(imgElement);
//   editor.selectContour(cnt_number.valueAsNumber);
//   editor.logSelectedContour();
//   clear_canvas('canvasOutput3')
//   cv.imshow('canvasOutput3', editor.getContourImage(cL_slider.valueAsNumber, cH_slider.valueAsNumber));
//   const idx = Number(cnt_number.value);
//   const contour = contours.get(idx);
//   const mat = cv.imread(imgElement);
//   const filled = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
//   cv.drawContours(filled, contours, idx, new cv.Scalar(255, 255, 255), cv.FILLED);
//   cv.imshow('canvasOutput1', filled);
//   const area = cv.contourArea(contour, false);
//   const rect = cv.boundingRect(contour);
//   const rectArea = rect.width * rect.height;
//   const extent = area / rectArea;
//   const hull = new cv.Mat();
//   cv.convexHull(contour, hull, false, true);
//   const hullArea = cv.contourArea(hull, false);
//   const solidity = area / hullArea;
//   console.log(
//     `Area: ${area}
// Arc Length: ${cv.arcLength(contour, true)}
// Extent: ${extent}
// Solidity: ${solidity}`
//   );
//   mat.delete();
//   hull.delete();
// }
// async function processImg(): Promise<void> {
//   try {
//     cv = cv instanceof Promise ? await cv : cv;
//     if (!inputImage) {
//       inputImage = cv.imread(imgElement);
//     }
//     const mat = inputImage.clone();
//     const cnt_img = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC1);
//     filled = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
//     if (cannyChanged) {
//       const gray = new cv.Mat();
//       canny = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC1);
//       point_map_img = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC1);
//       contours = new cv.MatVector();
//       const hierarchy = new cv.Mat();
//       const cl = cL_slider.valueAsNumber;
//       const ch = cH_slider.valueAsNumber;
//       cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
//       cv.Canny(gray, canny, cl, ch);
//       cv.findContours(
//         canny,
//         contours,
//         hierarchy,
//         cv.RETR_EXTERNAL,
//         cv.CHAIN_APPROX_SIMPLE
//       );
//       gray.delete();
//       hierarchy.delete();
//       cannyChanged = false;
//     }
//     cv.drawContours(filled, contours, -1, new cv.Scalar(255, 255, 255), cv.FILLED);
//     point_map = new cv.Mat(mat.rows, mat.cols, cv.CV_16SC1, new cv.Scalar(-1));
//     for (let i = 0; i < contours.size(); ++i) {
//       const contour = contours.get(i);
//       for (let j = 0; j < contour.rows; ++j) {
//         const p = contour.intPtr(j, 0);
//         point_map.data16S[p[1] * mat.cols + p[0]] = i;
//         point_map_img.ucharPtr(p[1], p[0])[0] = 255;
//       }
//     }
//     const selected = Number(cnt_number.value);
//     if (contours.get(selected)) {
//       cv.drawContours(cnt_img, contours, selected, new cv.Scalar(255), cv.FILLED);
//       cv.drawContours(
//         filled,
//         contours,
//         selected,
//         new cv.Scalar(255, 0, 0),
//         cv.FILLED
//       );
//     }
//     cv.imshow('canvasOutput1', cnt_img);
//     cv.imshow('canvasOutput2', filled);
//     //cv.imshow('canvasOutput3', point_map_img);
//     const output = document.getElementById('output');
//     if (output) output.style.display = 'block';
//     mat.delete();
//     console.log("end")
//   } catch (err) {
//     console.error(err);
//   }
// }
// imgElement.onload = processImg;
// cL_slider.oninput = async () => {
//   const disp = document.getElementById('cLow_display');
//   if (disp) disp.innerHTML = cL_slider.value;
//   clear_canvas('canvasOutput3');
//   cnt_number.value = '0';
//   cannyChanged = true;
//   await processImg();
// };
// cH_slider.oninput = async () => {
//   const disp = document.getElementById('cHigh_display');
//   if (disp) disp.innerHTML = cH_slider.value;
//   clear_canvas('canvasOutput3');
//   cnt_number.value = '0';
//   cannyChanged = true;
//   await processImg();
// };
// cnt_number.oninput = () => {
//   processImg();
// };
// canvas2.addEventListener('click', (event: MouseEvent) => {
//   if (!point_map || !contours) return;
//   const rect = canvas2.getBoundingClientRect();
//   const cx = Math.round(event.clientX - rect.left);
//   const cy = Math.round(event.clientY - rect.top);
//   const r = 9;
//   const r2 = r * r;
//   let closest: { contour_idx: number; sqDist: number } | undefined;
//   for (let x = Math.max(cx - r, 0); x < Math.min(cx + r, point_map.rows); ++x) {
//     for (let y = Math.max(cy - r, 0); y < Math.min(cy + r, point_map.cols); ++y) {
//       const sqDist = (x - cx) ** 2 + (y - cy) ** 2;
//       const val = point_map.data16S[y * point_map.cols + x];
//       if (sqDist <= r2 && val !== -1) {
//         if (!closest || closest.sqDist > sqDist) {
//           closest = { contour_idx: val, sqDist };
//         }
//       }
//     }
//   }
//   if (closest) {
//     cnt_number.value = String(closest.contour_idx);
//     cnt_number.oninput?.(null as any);
//   }
// });
//# sourceMappingURL=main.js.map