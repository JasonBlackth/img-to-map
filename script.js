//const cv = require("./opencv");

  let contours;
  var Module = {
      // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
      async onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
      }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  let imgElement = document.getElementById('imageSrc');
  let inputElement = document.getElementById('fileInput');
  let slider = document.getElementById("threshold");
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
      let mat = cv.imread(imgElement);
      //console.log(cv.resize()) //cv.resize(mat.clone(), (0, 0), fx = 0.1, fy = 0.1)
      let binary = new cv.Mat();
      let gray = new cv.Mat();
      let canny = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
      let filled = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
      let hull_filled = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
      let cnt_img = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3); //cv.imread(document.getElementById("canvasOutput1"))
      let points = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
      contours = new cv.MatVector();
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
      
      // Find & Draw isolated Contour
      
      let contour = contours.get(+cnt_number.value)
      if (contour !== undefined){

        for (let i = 0; i < contours.size(); ++i){
          let contour = contours.get(i);
          for (let j = 0; j < contour.rows; ++j){
            let p = contour.intPtr(j, 0);
            let pixel = points.ucharPtr(p[1],p[0])
            pixel[0] = 255;
            pixel[1] = 255;
            pixel[2] = 255;
          }
        }
        
        
        cv.drawContours(cnt_img, contours, +cnt_number.value, new cv.Scalar(255, 255, 255), cv.FILLED)
        cv.drawContours( filled, contours, +cnt_number.value, new cv.Scalar(255,   0,   0), cv.FILLED)
      }


      
      let kernel = cv.Mat.ones(3,3, cv.CV_8U)
      let closed = new cv.Mat();
      cv.morphologyEx(filled, closed, cv.MORPH_CLOSE, kernel)
      cv.morphologyEx(closed, closed, cv.MORPH_OPEN, kernel)
      cv.imshow('canvasOutput1', cnt_img);
      cv.imshow('canvasOutput2', filled);
      cv.imshow('canvasOutput3', points);
      document.getElementById("output").style = "display: block;"

      mat.delete();
    }
    catch (err){
      console.log(err)
    }
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
      cnt_number.value = 0
      await processImg();
    }
    
    cH_slider.oninput = async function (){
      document.getElementById("cHigh_display").innerHTML = cH_slider.value
      clear_canvas("canvasOutput3")
      cnt_number.value = 0
      await processImg();
    }

    cnt_number.oninput = processImg;
    
    canvas2.addEventListener('click', (event) =>{
      var rect = canvas2.getBoundingClientRect();
      var x = event.clientX - rect.left; //x position within the element.
      var y = event.clientY - rect.top;  //y position within the element.
      console.log("Left? : " + x + " ; Top? : " + y + ".");
      if (contours === undefined) return;

      x_topLeft  = Math.max(x-5, 0)
      y_topLeft  = Math.max(y-5, 0)
      x_botRight = Math.min(x+5, rect.width)
      y_botRight = Math.min(y+5, rect.height)
      


      let clickArea = new cv.Rect(x_topLeft, y_topLeft, x_botRight - x_topLeft, y_botRight - y_topLeft)
      console.log(clickArea)
      for (let i = 0; i < contours.size(); ++i){
          let contour = contours.get(i);
          for (let j = 0; j < contour.rows; ++j){
            let p = contour.intPtr(j, 0);
            if (
                p[0] >= clickArea.x &&
                p[0] < clickArea.x + clickArea.width &&
                p[1] >= clickArea.y &&
                p[1] < clickArea.y + clickArea.height)
                {
                  if (Math.abs(x - p[0]) < 1 && Math.abs(y-p[1])){
                    realClosePoint = {x : p[0], y : p[1]};
                    console.log(realClosePoint)
                    cnt_number.value = i;
                    cnt_number.oninput();
                    return;
                  }

              }
          }
        }
        //processImg();

    })

   
    
