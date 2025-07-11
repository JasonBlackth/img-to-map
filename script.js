//const cv = require("./opencv");

  let contours;
  let inputImage;
  let filled, canny, point_map, point_map_img;
  let cannyChanged = true;

  var Module = {
      // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
      async onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
      }
  };

  function deleteContour(){
    let idx = +cnt_number.value
    if (contours === undefined || contours.size() <= idx) return;
    let contour = contours.get(idx)
    contours.set(idx, new cv.Mat(contour.rows, 1, cv.CV_32SC2, new cv.Scalar(-1)))
    processImg();
  }

  addEventListener("keydown", (event) => { if (event.key === "Delete") deleteContour() })


  let imgElement = document.getElementById('imageSrc');
  let inputElement = document.getElementById('fileInput');
  let cL_slider = document.getElementById("cannyLow");
  let cH_slider = document.getElementById("cannyHigh");
  let cnt_number = document.getElementById("cnt_number");
  let canvas2 = document.querySelector("#canvasOutput2");
  
  inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  }, false);
  
  let realClosePoint;
  
  // You can just declare global variables, and assign to them in one of the functions, and from then on, they will be initialised
  
  function clear_canvas(id){
    canvas = document.getElementById(id)
    ctx = canvas.getContext("2d")
    ctx.clearRect(0,0, canvas.width, canvas.height);
  }
  async function log_contour(){
    /* This is how you can change a contour
    let newContour = new cv.Mat(contour.rows, 1, cv.CV_32SC2);
    for (let i = 0; i < contour.rows; i++) {
      let pt = contour.intPtr(i, 0);
      newContour.intPtr(i, 0)[0] = 0;
      newContour.intPtr(i, 0)[1] = 0;
    }
    newContour.intPtr(contour.rows, 0)[0] = contour.intPtr(0, 0)[0] + 1;
    newContour.intPtr(contour.rows, 0)[1] = contour.intPtr(0, 0)[1];
    newContour.intPtr(contour.rows+1, 0)[0] = 32;
    newContour.intPtr(contour.rows+1, 0)[1] = 121;

    contours.set(+cnt_number.value, newContour)
    */
   /* And print them
   for (let j = 0; j < contour.rows; ++j) {
       let point = contour.intPtr(j, 0);  // get pointer to point [x, y]
       console.log(`x = ${point[0]}, y = ${point[1]}`);
   }*/
          
    let contour = contours.get(+cnt_number.value)
    let mat = cv.imread(imgElement);
    let filled = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
    cv.drawContours(filled, contours, +cnt_number.value, new cv.Scalar(255, 255, 255), cv.FILLED)
    cv.imshow("canvasOutput1", filled)
    let area = cv.contourArea(contour, false);
    let rect = cv.boundingRect(contour);
    let rectArea = rect.width * rect.height;
    console.log(rect);
    let extent = area / rectArea;
    let hull = new cv.Mat();
    cv.convexHull(contour, hull, false, true);
    let hullArea = cv.contourArea(hull, false);
    let solidity = area / hullArea;
    console.log(`Area: ${area}\nArc Length: ${cv.arcLength(contour, true)}\nExtent: ${extent}\nSolidity: ${solidity}\n`)
    /* Remove Contour (temporarily)
    let filled2 = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
    let newContour = cv.Mat.zeros(contour.rows, 1, cv.CV_32SC2);
    contours.set(+cnt_number.value, newContour);
    cv.drawContours(filled2, contours, -1, new cv.Scalar(255, 255, 255), cv.FILLED)
    cv.imshow('canvasOutput2', filled2);
    */
  }



  async function processImg(){
    try{
      
      cv = (cv instanceof Promise) ? await cv : cv;
      if (inputImage === undefined) inputImage = cv.imread(imgElement)
      let mat = inputImage.clone() 
      cnt_img = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC1);

      filled = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
      if (cannyChanged){
        let gray = new cv.Mat();
        canny = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC1);
        point_map_img = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC1);
        contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        let cl = Number(cL_slider.value);
        let ch = Number(cH_slider.value);
        cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
        cv.Canny(gray, canny, cl, ch)
        cv.findContours(canny, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
        
        cannyChanged = false;
      }
      cv.drawContours(filled, contours, -1, new cv.Scalar(255, 255, 255), cv.FILLED)
      
      // Find & Draw isolated Contour
      
      point_map = new cv.Mat(mat.rows, mat.cols, cv.CV_16SC1, new cv.Scalar(-1))
      for (let i = 0; i < contours.size(); ++i){
        let contour = contours.get(i);
        for (let j = 0; j < contour.rows; ++j){
          let p = contour.intPtr(j, 0);
          point_map.data16S[p[1] * mat.cols + p[0]] = i;
          let pixel = point_map_img.ucharPtr(p[1],p[0])
          pixel[0] = 255;
        }
      }
      if (contours.get(+cnt_number.value) !== undefined){
        cv.drawContours(cnt_img, contours, +cnt_number.value, new cv.Scalar(255), cv.FILLED)
        cv.drawContours( filled, contours, +cnt_number.value, new cv.Scalar(255,   0,   0), cv.FILLED)
      }
     
      cv.imshow('canvasOutput1', cnt_img);
      cv.imshow('canvasOutput2', filled);
      cv.imshow('canvasOutput3', point_map_img);
      document.getElementById("output").style = "display: block;"

      mat.delete();
    }
    catch (err){
      console.log(err)
    }
    }
    
    imgElement.onload = processImg;

    
    cL_slider.oninput = async function (){
      document.getElementById("cLow_display").innerHTML = cL_slider.value
      clear_canvas("canvasOutput3")
      cnt_number.value = 0
      cannyChanged = true;
      await processImg();
    }
    
    cH_slider.oninput = async function (){
      document.getElementById("cHigh_display").innerHTML = cH_slider.value
      clear_canvas("canvasOutput3")
      cnt_number.value = 0
      cannyChanged = true;
      await processImg();
    }

    cnt_number.oninput = processImg;
    
    canvas2.addEventListener('click', (event) =>{
      var rect = canvas2.getBoundingClientRect();
      var cx = Math.round(event.clientX - rect.left); //x position within the element.
      var cy = Math.round(event.clientY - rect.top);  //y position within the element.
      
      if (contours === undefined) return;
      const r = 9;
      const r2 = r*r;

      let closest;
      for (let x = Math.max(cx - r, 0); x < Math.min(cx + r, point_map.rows); ++x){
        for (let y = Math.max(cy - r, 0) ; y < Math.min(cy + r, point_map.cols) ; ++y){
            let sqDist = (x-cx)**2 + (y-cy)**2;
            let val = point_map.data16S[y * point_map.cols + x]
            if (sqDist <= r2 && val !== -1){
              if (closest === undefined || closest.sqDist > sqDist){
                closest = {contour_idx : val, sqDist : sqDist}
              }
            }
        }
      }
      if (closest !== undefined){
        cnt_number.value = closest.contour_idx
        cnt_number.oninput();
      }


    })

   
    
