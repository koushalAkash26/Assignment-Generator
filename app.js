content=document.getElementById("content")
let textArea=document.querySelector("textarea")
textArea.addEventListener("input",function(e){
    console.log(textArea.value)
    content.innerText=textArea.value


})