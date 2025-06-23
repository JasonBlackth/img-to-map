
  let imgElement = document.getElementById('imageSrc');
  let inputElement = document.getElementById('fileInput');
  let slider = document.getElementById("threshold");
  let cL_slider = document.getElementById("cannyLow");
  let cH_slider = document.getElementById("cannyHigh");
  inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  }, false);
  
  async function processImg(){
    console.log("doin sth")
    cv = (cv instanceof Promise) ? await cv : cv;
    let mat = cv.imread(imgElement);
    //console.log(cv.resize()) //cv.resize(mat.clone(), (0, 0), fx = 0.1, fy = 0.1)
    binary = new cv.Mat();
    gray = new cv.Mat();
    edges = new cv.Mat();
    filled = new cv.Mat();
    th = Number(slider.value);
    cl = Number(cL_slider.value);
    ch = Number(cH_slider.value);
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
    cv.threshold(gray, binary, th, 255, cv.THRESH_BINARY) //cv.THRESH_BINARY+cv.THRESH_OTSU
    cv.Canny(gray, edges, cl, ch)
    //cv.drawContours(filled, edges, -1, color=(255, 255, 255), thickness=cv.FILLED)
    console.log(cv.findContours(edges, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE))
    cv.imshow('canvasOutput1', gray);
    cv.imshow('canvasOutput2', edges);
    cv.imshow('canvasOutput3', filled);
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
    canvas = document.getElementById("canvasOutput3")
    ctx = canvas.getContext("2d")
    ctx.clearRect(0,0, canvas.width, canvas.height);
    await processImg();
  }
  
  cH_slider.oninput = async function (){
    document.getElementById("cHigh_display").innerHTML = cH_slider.value
    canvas = document.getElementById("canvasOutput3")
    ctx = canvas.getContext("2d")
    ctx.clearRect(0,0, canvas.width, canvas.height);
    await processImg();
  }

  var Module = {
    // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
    onRuntimeInitialized() {
      document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
  };