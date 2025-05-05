const dropzone = document.getElementById("drop_zone");
const dropzoneMsg = document.querySelector("#drop_zone p");
const input = document.querySelector("input");

dropzone.addEventListener('click', (e) => {
  input.click();
});


function preload(){
  classifier = ml5.imageClassifier("MobileNet");
  document.getElementById("column-l").style.display="none";
  document.getElementById("column-r").style.display="none";
  
  document.getElementById("upload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Überprüfen, ob die Datei ein Bild ist
    const validImageTypes = ['image/jpeg', 'image/png'];
    if (!validImageTypes.includes(file.type)) {
        alert('Die hochgeladene Datei ist kein Bild. Bitte wählen Sie ein Bild im JPEG-, PNG-Format aus.');
        event.preventDefault();
        return;
    }

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        //console.log(img);

        img.onload = function() {
          let imgwidth;
          let imgheight;
          let imgdx = 0;
          let imgdy = 0;
          //console.log("Breite des Bildes: " + img.width + " / Höhe des Bildes: " + img.height);
          if (img.width >= img.height) {
            imgwidth = 500;
            imgheight = img.height / img.width * 500;
            imgdy = (500 - imgheight) / 2;
          } else {
            imgheight = 500;
            imgwidth = img.width / img.height * 500;
            imgdx = (500 - imgwidth) / 2;
          }
            
          const canvas = document.getElementById("canvas");
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Leert das Canvas und zeichnet das Bild
          ctx.drawImage(img, imgdx, imgdy, imgwidth, imgheight); // Bild an die Größe des Canvas anpassen
          classifier.classify(img, gotResults, 5);
          
          document.getElementById("column-l").style.removeProperty("display");
          document.getElementById("column-r").style.removeProperty("display");
        }
    }

    if (file) {
        reader.readAsDataURL(file);
        
    }
    
    
  });
}



function gotResults(results){
  //console.log(results);
  label = results[0].label;
  conf = results[0].confidence;

  printPlot(results);
}



function printPlot(results){
  // console.log(results);
  let data;
  let x = [];
  let y = [];
  //console.log(data);
  
  for (let i = 0; i < 5; i++){
    //console.log(results[i]);
    if (results[i].label.includes(",")) {
      let tmp = results[i].label.split(",");
      console.log(tmp);
      x.push(tmp[0]);
      console.log(tmp[0]);
    } else {
      x.push(results[i].label);
    }
    
    y.push(round(results[i].confidence * 100, 2));
  }
  console.log("x " + x);
  console.log("y " + y);
  
  data = [
    {
      x: x,
      y: y,
      text: y,
      type: 'bar',
      textposition: 'inside'
    }
  ];
  
  var layout = {
    margin: {
      l: 50,
      r: 50,
      t: 50,
      b: 200
    },
    height: 500,
    
    title: {
      text: 'Klassifikation des Eingabebildes'
    },
    
    xaxis: {
      //title: {
      //  text: "classes",
      //},
      tickangle: -90
    },
    
    yaxis: {
      title: {
        text: "confidence in %",
      }
      
    }
  };
  
  Plotly.newPlot("plot", data, layout);
    
}


// Bildervergrößerung
const thumbnails = document.querySelectorAll('.thumbnail');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');


document.querySelectorAll('.image-container').forEach(item => {
  item.addEventListener('click', event => {
      const imgSrc = item.querySelector('.image').src;
      
      lightboxImage.src = imgSrc;
      lightbox.style.display = 'flex'; 
    
  });
});


lightbox.addEventListener('click', function() {
    lightbox.style.display = 'none'; 
});



function setup() {

}

function draw() {
  
}