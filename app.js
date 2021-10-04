
let pageElement=document.querySelector('.paper')
let pageElement1=document.querySelector('.paper .content')
let pattern=document.querySelector(".bgParent")
const customTextStyle = (attrib, v) => (pageElement.style[attrib] = v);
const overlayEl = document.querySelector('.overlay');
let paperContentPadding;
let outputImages = [];
  const EVENT_MAP = {
    '#generate-image-form': {
      on: 'submit',
      action: (e) => {
        e.preventDefault();
      
        generateImages();
      }
    },
      '#font--Style': {
        on: 'change',
        action: (e) =>
          document.body.style.setProperty('--handwritingFont', e.target.value)
          
      },
      '#fontFile': {
        on: 'change',
        action: (e) => addFontFromFile(e.target.files[0])
      },
    '#fontSize':{
      on:'change',
      action: (e)=>{
        if (e.target.value > 30) {
          alert('Font-size is too big try upto 30');
        }else{
        customTextStyle('fontSize', e.target.value + 'pt');
        e.preventDefault();
        }
      }
    },
    '#fontColor':{
      on:'change',
      action: (e)=>{
        document.body.style.setProperty('--inkColor', e.target.value)
      }
    },
    '#top-verticalAlign':{
      on:'change',
      action:(e)=>{
        document.querySelector(".paper .content").style.top=verticalAlign(document.querySelector("#top-verticalAlign").value )
      }
    },
  '#letterSpacing': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 40) {
        alert('Letter Spacing is too big try a number upto 40');
      } else {
        customTextStyle('letterSpacing', e.target.value + 'px');
        e.preventDefault();
      }
    }
  },
  '#wordSpacing': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 100) {
        alert('Word Spacing is too big try a number upto hundred');
      } else {
        customTextStyle('wordSpacing', e.target.value + 'px');
        e.preventDefault();
      }
    }
  }
  ,'#margin-on': {
    on: 'change',
    action: () => {
      if (pageElement.classList.contains('margined')) {
        pageElement.classList.remove('margined');
      } else {
        pageElement.classList.add('margined');
      }
    }
  },
  
  '#line-on': {
    on: 'change',
    action: () => {
      if(pageElement.classList.contains("lines")){
        pageElement.classList.remove('lines');
      }
      else{
        pageElement.classList.add('lines');
      }
    }
  },
  '#downloadpdfButton':{
    on:'click',
    action:()=>{
      createpdf(outputImages)
    }
  },
  '#deleteAllButton':{
    on:'click',
    action:()=>{
      deleteAll()
    }
  },
  '.paper .content': {
    on: 'paste',
    action:formatText
    } 
  
   }

for (const eventSelector in EVENT_MAP) {
    document
      .querySelector(eventSelector)
      .addEventListener(
        EVENT_MAP[eventSelector].on,
        EVENT_MAP[eventSelector].action
      );
}
function verticalAlign(val){
  
  if(parseInt(val)<0){
    
    res=55+parseInt(val)
    let value=res+"px"
    return value
  }
  else{
    res=55+parseInt(val)
    let value=res+"px"
    return value
  }
}

function formatText(event) {
  event.preventDefault();
  const text = event.clipboardData
  .getData('text/plain')
  .replace(/\n/g, '<br/>');
  document.execCommand('insertHTML', false, text);
  document.getElementsByClassName('left-margin-and-content')[0].style.setProperty('min-height' ,`${document.getElementsByClassName('content')[0].scrollHeight }px`)
}
function deleteAll(){
  outputImages=[]
  document.getElementById("output").innerHTML=`Click "Generate Image" Button to generate new image.`
  document.querySelector('#downloadpdfButton').classList.remove('show');
  document.querySelector('#deleteAllButton').classList.remove('show');
  document.querySelector('#output-header').innerHTML ='output'

}
function createpdf(imgs) {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF('p', 'pt', 'a4');
  const width = doc.internal.pageSize.width;
  const height = doc.internal.pageSize.height;
  for (const i in imgs) {
    doc.text(10, 20, '');
    doc.addImage(
      imgs[i],
      'JPEG',
      25,
      50,
      width - 50,
      height - 80,
      'image-' + i
    );
    if (i != imgs.length - 1) {
      doc.addPage();
    }
  }
  doc.save();
}

function removePaperStyles() {
  

  if (document.querySelector('#effect').value === 'scanner') {
    overlayEl.classList.remove('shadows');
  } else {
    overlayEl.classList.remove(document.querySelector('#effect').value);
  }
  /*if (isFontErrory()) {
    pageElement1.style.paddingTop = `${paperContentPadding}px`;
  }*/
  
}

function contrastImage(imageData, contrast) {
  const data = imageData.data;
  contrast *= 255;
  const factor = (contrast + 255) / (255.01 - contrast);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
  return imageData;
}
function applyPaperStyles() {
 

  
  if (document.querySelector('#effect').value === 'scanner') {
    overlayEl.classList.add('shadows');
  } else {
    overlayEl.classList.add(document.querySelector('#effect').value);
  }

  if (document.querySelector('#effect').value === 'scanner') {
   
   
    overlayEl.style.background = `linear-gradient(${
      Math.floor(Math.random() * (120 - 50 + 1)) + 50
    }deg, #0008, #0000)`;
  } else if (document.querySelector('#effect').value === 'shadows') {

    overlayEl.style.background = `linear-gradient(${
      Math.random() * 360
    }deg, #0008, #0000)`;
  }
  
  
  
}
function addFontFromFile(fileObj) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const newFont = new FontFace('temp-font', e.target.result);
    
    newFont.load().then((loadedFace) => {
      
      document.fonts.add(loadedFace);
      pageElement.style.fontFamily = 'temp-font';
      
      //document.body.style.setProperty('--handwritingFont', `${'temp-font'}`)
          
    });
  };
  reader.readAsArrayBuffer(fileObj);
}
function moveRight(pos){
  if(pos===outputImages.length-1){
    renderOutput(outputImages)
  }
  else{
  [outputImages[pos],outputImages[pos+1]]=[outputImages[pos+1],outputImages[pos]]
  renderOutput(outputImages)
  
  }

}
function moveLeft(pos){
  if(pos===0){
    renderOutput(outputImages)
  }
  else{
  [outputImages[pos-1],outputImages[pos]]=[outputImages[pos],outputImages[pos-1]]
  renderOutput(outputImages)
  
  }

}

function setRemoveImageListeners() {
  document
    .querySelectorAll('.output-image-container > .close-button')
    .forEach((closeButton) => {
      closeButton.addEventListener('click', (e) => {
        outputImages.splice(Number(e.target.dataset.index), 1);
        // Displaying no. of images on deletion
        if (outputImages.length >= 0) {
          document.querySelector('#output-header').textContent =
            'Output' +
            (outputImages.length ? ' ( ' + outputImages.length + ' )' : '');
            renderOutput(outputImages);
            setRemoveImageListeners()
        }
        if(outputImages.length===0){
          document.getElementById("output").innerHTML=`Click "Generate Image" Button to generate new image.`
          document.querySelector('#downloadpdfButton').classList.remove('show');
          document.querySelector('#deleteAllButton').classList.remove('show');
        }
        
      })
    })
    document.querySelectorAll('.output-image-container .move-right').forEach((rightButton)=>{
      rightButton.addEventListener('click',(e)=>{
          moveRight(Number(e.target.dataset.index))
          setRemoveImageListeners()
          
          
      })
    })
    document.querySelectorAll('.output-image-container .move-left').forEach((leftButton)=>{
      leftButton.addEventListener('click',(e)=>{
          moveLeft(Number(e.target.dataset.index))
          setRemoveImageListeners()
          
      })
    })
    
  }
function renderOutput(outputImages) {
    if (outputImages.length <= 0) {
      /*document.querySelector('#output').innerHTML =
        'Click "Generate Image" Button to generate new image.';
      document.querySelector('#download-as-pdf-button').classList.remove('show');
      document.querySelector('#delete-all-button').classList.remove('show');
      return;*/
    }
  
    document.querySelector('#downloadpdfButton').classList.add('show');
    document.querySelector('#deleteAllButton').classList.add('show');
    document.querySelector('#output').innerHTML = outputImages
      .map(
        (outputImageCanvas, index) => /* html */ `
      <div 
        class="output-image-container" data-cont="${index}" 
        style="position: relative;display: inline-block;"
      >
        <button 
          data-index="${index}" 
          class="close-button close-${index}">
            &times;
        </button>
        <img 
          class="shadow" 
          alt="Output image ${index}" 
          src="${outputImageCanvas.toDataURL('image/jpeg')}"
        />
        <div style="text-align: center">
          <a 
            class="button download-image-button" 
            download 
            href="${outputImageCanvas.toDataURL('image/jpeg')}
          ">Download Image</a>
          <br/>
          <br/>
          <button 
            class="button move-left"
            data-index="${index}" 
          >
            Move Left
          </button>
          <button 
            class="button move-right"
            data-index="${index}" 
          >
            Move Right
          </button>
        </div>
      </div>
      `
      )
      .join('');
  }
  
 async function convertDIVToImage() {
  const options = {
    scrollX: 0,
    scrollY: -window.scrollY,
    scale: document.querySelector("#qual").value,
    useCORS: true
  };
  
    /** Function html2canvas comes from a library html2canvas which is included in the index.html */
    const canvas =  await(html2canvas(pageElement, options));
  
    /** Send image data for modification if effect is scanner */
    if (document.querySelector('#effect').value === 'scanner') {
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      contrastImage(imageData, 0.55);
      canvas.getContext('2d').putImageData(imageData, 0, 0);
    }
  
    outputImages.push(canvas);
    // Displaying no. of images on addition
    if (outputImages.length >= 1) {
      document.querySelector('#output-header').textContent =
        'Output ' + '( ' + outputImages.length + ' )';
    }
  }
 async function generateImages(){
    applyPaperStyles()
    pageElement.scroll(0,0)
    const paperContentEl = document.querySelector('.paper .content');
    
    const scrollHeight = paperContentEl.scrollHeight;
    const clientHeight = 514; // height of .paper-content when there is no content

    const totalPages = Math.ceil(scrollHeight / clientHeight);
   
    /*const initialPaperContent = paperContentEl.innerHTML;
    console.log(initialPaperContent)
    const splitContent = initialPaperContent.split(/\s+/);
    console.log(splitContent.length)*/
    if (totalPages > 1) {
        // For multiple pages
        
        const initialPaperContent = paperContentEl.innerHTML;
        const splitContent = initialPaperContent.split(/(\s+)/);
    
        // multiple images
        let wordCount = 0;
        for (let i = 0; i < totalPages; i++) {
          paperContentEl.innerHTML = '';
          const wordArray = [];
          let wordString = '';
    
          while (
            paperContentEl.scrollHeight <= clientHeight &&
            wordCount <= splitContent.length
          ) {
            wordString = wordArray.join(' ');
            wordArray.push(splitContent[wordCount]);
            paperContentEl.innerHTML = wordArray.join(' ');
            wordCount++;
          }
          /*paperContentEl.innerHTML = wordString;
          console.log(`1-->${wordCount}`)
          wordCount--;
          console.log(`2-->${wordCount}`)*/
          pageElement.scrollTo(0, 0);
           await convertDIVToImage();
          paperContentEl.innerHTML = initialPaperContent;
        }
      } else {
        // single image
          await convertDIVToImage();
      }
    
      removePaperStyles()
      renderOutput(outputImages);
      setRemoveImageListeners()

      
    }
   
    
    
