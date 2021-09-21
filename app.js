
let pageElement=document.querySelector('.paper')
let pageElement1=document.querySelector('.cont')
let outputImages = [];
  
  const EVENT_MAP = {
    '#generate-image-form': {
      on: 'submit',
      action: (e) => {
        e.preventDefault();
        generateImages();
      }
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
function renderOutput(outputImages) {
    if (outputImages.length <= 0) {
      /*document.querySelector('#output').innerHTML =
        'Click "Generate Image" Button to generate new image.';
      document.querySelector('#download-as-pdf-button').classList.remove('show');
      document.querySelector('#delete-all-button').classList.remove('show');
      return;*/
    }
  
    /*document.querySelector('#download-as-pdf-button').classList.add('show');
    document.querySelector('#delete-all-button').classList.add('show');*/
    console.log(outputImages)
    document.querySelector('#output').innerHTML = outputImages
      .map(
        (outputImageCanvas, index) => /* html */ `
      <div 
        class="output-image-container" 
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
    scale: 3,
    useCORS: true
  };
  
    /** Function html2canvas comes from a library html2canvas which is included in the index.html */
    const canvas =  await(html2canvas(pageElement, options));
  
    /** Send image data for modification if effect is scanner */
   /* if (document.querySelector('#page-effects').value === 'scanner') {
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      contrastImage(imageData, 0.55);
      canvas.getContext('2d').putImageData(imageData, 0, 0);
    }*/
  
    outputImages.push(canvas);
    // Displaying no. of images on addition
    if (outputImages.length >= 1) {
      document.querySelector('#output-header').textContent =
        'Output ' + '( ' + outputImages.length + ' )';
    }
  }
 async function generateImages(){
    pageElement.scroll(0,0)
    const paperContentEl = document.querySelector('.paper .content');
    console.log("hello")
    const scrollHeight = paperContentEl.scrollHeight;
    console.log(scrollHeight)
    const clientHeight = 514; // height of .paper-content when there is no content

    const totalPages = Math.ceil(scrollHeight / clientHeight);
    console.log(totalPages)
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
    
      
      renderOutput(outputImages);
      
    }
    
    
