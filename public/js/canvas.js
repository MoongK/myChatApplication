let canvas;



window.addEventListener("DOMContentLoaded", function(){
    canvas = document.getElementById("mainCanvas");

    canvas.addEventListener("mousemove", function(event){
        console.log(`x : ${event.offsetX}, y : ${event.offsetY}`);
    });
});