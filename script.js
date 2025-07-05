//const cv = require("./opencv");

  let imgElement = document.getElementById('imageSrc');
  let inputElement = document.getElementById('fileInput');
  let slider = document.getElementById("threshold");
  let cL_slider = document.getElementById("cannyLow");
  let cH_slider = document.getElementById("cannyHigh");
  let cnt_number = document.getElementById("cnt_number");
  inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  }, false);

  
  
  function clear_canvas(id){
    canvas = document.getElementById(id)
    ctx = canvas.getContext("2d")
    ctx.clearRect(0,0, canvas.width, canvas.height);
  }
  async function log_contour(){
    cv = (cv instanceof Promise) ? await cv : cv;
    let mat = cv.imread(imgElement);
    let gray = new cv.Mat();
    let canny = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
    let filled = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    let cl = Number(cL_slider.value);
    let ch = Number(cH_slider.value);
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
    cv.Canny(gray, canny, cl, ch)
    cv.findContours(canny, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    let contour = contours.get(+cnt_number.value)
    //let contour = contours.get(i);  // contour is a cv.Mat
    let newContour = new cv.Mat(contour.rows + 2, 1, cv.CV_32SC2);
    for (let i = 0; i < contour.rows; i++) {
      let pt = contour.intPtr(i, 0);
      newContour.intPtr(i, 0)[0] = pt[0];
      newContour.intPtr(i, 0)[1] = pt[1];
    }
    newContour.intPtr(contour.rows, 0)[0] = contour.intPtr(0, 0)[0] + 1;
    newContour.intPtr(contour.rows, 0)[1] = contour.intPtr(0, 0)[1];
    newContour.intPtr(contour.rows+1, 0)[0] = 32;
    newContour.intPtr(contour.rows+1, 0)[1] = 121;

    contours.set(+cnt_number.value, newContour)
    cv.drawContours(filled, contours, +cnt_number.value, new cv.Scalar(255, 255, 255), cv.FILLED)
    cv.imshow("canvasOutput1", filled)
    contour = contours.get(+cnt_number.value)
    for (let j = 0; j < contour.rows; ++j) {
        let point = contour.intPtr(j, 0);  // get pointer to point [x, y]
        console.log(`x = ${point[0]}, y = ${point[1]}`);
    }
    /*
    console.log(mtx);
    let ones = cv.Mat.ones(3,3, cv.CV_8UC3)
    console.log(ones)
    console.log(ones.at(0,0))*/


  }


  async function processImg(){
    cv = (cv instanceof Promise) ? await cv : cv;
    let mat = cv.imread(imgElement);
    //console.log(cv.resize()) //cv.resize(mat.clone(), (0, 0), fx = 0.1, fy = 0.1)
    let binary = new cv.Mat();
    let gray = new cv.Mat();
    let canny = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
    let filled = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
    let hull_filled = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
    let cnt_img = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3); //cv.imread(document.getElementById("canvasOutput1"))
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    let th = Number(slider.value);
    let cl = Number(cL_slider.value);
    let ch = Number(cH_slider.value);
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
    cv.threshold(gray, binary, th, 255, cv.THRESH_BINARY) //cv.THRESH_BINARY+cv.THRESH_OTSU
    cv.Canny(gray, canny, cl, ch)
    cv.findContours(canny, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    let hull = new cv.MatVector();
    for (let i = 0; i<contours.size(); i++){
      let temp = new cv.Mat()
      cv.convexHull(contours.get(i), temp);
      hull.push_back(temp)
      temp.delete()
    }
    cv.drawContours(hull_filled, hull, -1, new cv.Scalar(255, 255, 255), cv.FILLED)
    cv.drawContours(filled, contours, -1, new cv.Scalar(255, 255, 255), cv.FILLED)
    
    // Update at cnt_number
    
    let contour = contours.get(+cnt_number.value)
    let newContour = new cv.Mat(contour.rows + 1, 1, cv.CV_32SC2);
    for (let i = 0; i < contour.rows; i++) {
        let pt = contour.intPtr(i, 0);
        newContour.intPtr(i, 0)[0] = pt[0];
        newContour.intPtr(i, 0)[1] = pt[1];
    }
    newContour.intPtr(contour.rows, 0)[0] = contour.intPtr(0, 0)[0];
    newContour.intPtr(contour.rows, 0)[1] = contour.intPtr(0, 0)[1];
    contours.set(+cnt_number.value, newContour)
    
   
   
    cv.drawContours(cnt_img, contours, +cnt_number.value, new cv.Scalar(255, 255, 255), cv.FILLED)
    let kernel = cv.Mat.ones(3,3, cv.CV_8U)
    let closed = new cv.Mat();
    cv.morphologyEx(filled, closed, cv.MORPH_CLOSE, kernel)
    cv.morphologyEx(closed, closed, cv.MORPH_OPEN, kernel)
    cv.imshow('canvasOutput1', cnt_img);
    cv.imshow('canvasOutput2', filled);
    cv.imshow('canvasOutput3', hull_filled);
    document.getElementById("output").style = "display: block;"
    mat.delete();
  }

  imgElement.onload = processImg;

  slider.oninput = async function (){
    document.getElementById("th_display").innerHTML = slider.value
    Array.from(document.getElementsByTagName("canvas")).forEach(canvas => {
        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    await processImg();
  }

  cL_slider.oninput = async function (){
    document.getElementById("cLow_display").innerHTML = cL_slider.value
    clear_canvas("canvasOutput3")
    await processImg();
  }
  
  cH_slider.oninput = async function (){
    document.getElementById("cHigh_display").innerHTML = cH_slider.value
    clear_canvas("canvasOutput3")
    await processImg();
  }

  cnt_number.oninput = processImg;

  var Module = {
    // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
    onRuntimeInitialized() {
      document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
  };