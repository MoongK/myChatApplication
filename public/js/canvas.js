let canvas; // canvas 객체
let ctx; // 2d 그리기 객체
let paintOn = false; // 그릴지 안그릴지 정하는 변수(true:그리기 / false:안그리기)

const INITIAL_COLOR = "black"; // 기본 컬러
const CANVAS_SIZE = 500; // 캔버스 사이즈(시작시 지정 안해주면 이상하게 그려진다. 필수.)
const INITIAL_LINEWIDTH = "2.5"; // 기본 펜 굵기

window.addEventListener("DOMContentLoaded", function(){

    canvasInit();

    canvas.addEventListener("mousemove", function(event){
        let x = event.offsetX;
        let y = event.offsetY;

        if(paintOn){
            startPainting(x,y);
        }
        else{
            readyToPainting(x,y);
        }
    });

    canvas.addEventListener("mousedown", function(){
        paintOn = true;
    });

    canvas.addEventListener("mouseup", function(){
        paintOn = false;
    });
    canvas.addEventListener("mouseout", function(){
        paintOn = false;
    });

    const colors = document.getElementsByClassName("palette_color");
    if(colors){
        Array.from(colors).forEach(color => color.addEventListener("click", colorChange));
    }
});

// 컬러 변경
function colorChange(event){

    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
}

// 선 그리기
function startPainting(x,y){
    ctx.lineTo(x, y);
    ctx.stroke();
}

// 선 그리기 준비
function readyToPainting(x,y){
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 초기 캔버스 셋팅
function canvasInit(){
    canvas = document.getElementById("mainCanvas");
    if(canvas){
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        ctx = canvas.getContext('2d');
        ctx.lineWidth = INITIAL_LINEWIDTH;
        ctx.strokeStyle = INITIAL_COLOR;
    }
    else{
        alert("캔버스를 찾을 수 없습니다.");
    }

}