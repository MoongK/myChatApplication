let canvas; // canvas 객체
let ctx; // 2d 그리기 객체
let paintOn = false; // 그릴지 안그릴지 정하는 변수(true:그리기 / false:안그리기)

const INITIAL_COLOR = "black"; // 기본 컬러
const CANVAS_SIZE = 500; // 캔버스 사이즈(시작시 지정 안해주면 이상하게 그려진다. 필수.)
const INITIAL_LINEWIDTH = "2.5"; // 기본 펜 굵기
let changedColor = INITIAL_COLOR; // 변경되는 컬러가 저장되는 값
let currentDrawMode; // 그리기 모드
let currentColor; // 현재 펜 색
let drawMode; // 그리기모드(그리기, 채우기)
let canvasEraser; // 지우개
let canvasClean; // 캔버스 클리너
let penWidth; // 펜 굵기
let palette; // 펜 색변경 파레트
let turnSet; // 그리기 신청 / 턴 넘기기 버튼
const TEXT_MYTURN = "내가 그리기!";
const TEXT_OTHERTURN = '턴 넘기기!';
let drawingUser; // 그리고 있는 유저 표시버튼
let isMyturn; // 내 턴인지 체크하는 변수(true, false);

window.addEventListener("DOMContentLoaded", function(){

    canvasInit();

    canvas.addEventListener("mousemove", function(event){
        if(!isMyturn)
            return;
        let x = event.offsetX;
        let y = event.offsetY;

        if(paintOn){
            startPainting(x,y);
        }
        else{
            readyToPainting(x,y);
        }
    });

    canvas.addEventListener("mousedown", function(x, y){
        if(!isMyturn)
            return;

        if(currentDrawMode == "Fill"){
            ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            socket.emit("other_userFill", {color:changedColor});
        }
        else if(currentDrawMode == "Draw"){
            socket.emit("other_userReadyDraw",{x:x,y:y});
        }
        paintOn = true;
    });

    canvas.addEventListener("mouseup", function(){
        if(!isMyturn)
            return;
        paintOn = false;
    });
    canvas.addEventListener("mouseout", function(){
        if(!isMyturn)
            return;
        paintOn = false;
    });

    // 파레트 셋팅
    if(palette){
        Array.from(palette).forEach(color => color.addEventListener("click", colorChange));
    }

    // 그리기모드 셋팅
    drawMode.addEventListener("click", canvasDrawModeCont);

    // eraser 기능 셋팅
    canvasEraser.addEventListener("click", canvasEraserCont);

    // canvas 클린
    canvasClean.addEventListener("click", canvasCleaning);

    // 펜 굵기 조절바 셋팅
    penWidth.addEventListener("input", function(){
        penWidthCont(penWidth);
    });

    // 턴 신청 / 턴 넘기기
    turnSet.addEventListener("click", turnChange);

});

// 턴 신청/넘기기 함수
function turnChange(){
    if(isMyturn){
        // 턴 넘기기
        socket.emit("turnEnd", {id:socket.id});
    }
    else{
        // 턴 신청하기
        socket.emit("turnRequire", {id:socket.id});
    }
}

// drawMode 컨트롤 함수
function canvasDrawModeCont(){

    if(this.value == "Draw"){
        this.value = "Fill";
        currentDrawMode = "Fill";
        canvasEraser.style.display="none";
        canvasClean.style.display="none";
    }
    else if(this.value == "Fill"){
        this.value = "Draw";
        currentDrawMode = "Draw";
        canvasEraser.style.display="";
        canvasClean.style.display="";
    }
}

// canvas 지우개 색지정 함수
function canvasEraserCont(){

    if(canvas.style.backgroundColor != ""){
        changedColor = canvas.style.backgroundColor;
    }
    else{
        changedColor = window.getComputedStyle(canvas).getPropertyValue("background-color");
    }

    ctx.strokeStyle = changedColor;
}

// canvas 클린 함수
function canvasCleaning(){

    if(!isMyturn)
        return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("other_canvasClean");
}

// 펜 굵기 변경 함수
function penWidthCont(penWidth){
    ctx.lineWidth = penWidth.value;
}

// 컬러 변경 함수
function colorChange(event){
    changedColor = event.target.style.backgroundColor;
    currentColor.style.backgroundColor = changedColor;
    ctx.strokeStyle = changedColor;
    ctx.fillStyle = changedColor;
}

// 선 그리기 함수
function startPainting(x,y){
    ctx.lineTo(x, y);
    ctx.stroke();
    socket.emit("other_userDraw",{x:x,y:y,color:changedColor,penWidth:penWidth.value});
}

// 선 그리기 준비 함수
function readyToPainting(x,y){
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 초기 캔버스 셋팅 함수
function canvasInit(){
    canvas = document.getElementById("mainCanvas");
    if(canvas){
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;

        drawMode = document.getElementById("drawMode");
        canvasEraser = document.getElementById("canvasEraser");
        canvasClean = document.getElementById("canvasClean");
        currentColor = document.getElementById("currentColor");
        penWidth = document.getElementById("penWidth");
        palette = document.getElementsByClassName("palette_color");
        turnSet = document.getElementById("turnSet");
        drawingUser = document.getElementById("DrawingUser");
        isMyturn = false;
        
        currentDrawMode = "Draw";
        drawMode.value = currentDrawMode;
        changedColor = INITIAL_COLOR;
        penWidth.value = INITIAL_LINEWIDTH; 
        currentColor.style.backgroundColor = changedColor;

        ctx = canvas.getContext('2d');
        ctx.lineWidth = INITIAL_LINEWIDTH;
        ctx.strokeStyle = changedColor;
        ctx.fillStyle = changedColor;
    }
    else{
        alert("캔버스를 찾을 수 없습니다.");
    }
}

// 새로운 유저가 들어왔을 때 그림을 그리고 있는 유저를 버튼에 적어준다.
socket.on('newUserNotice', function(data){
    setDrawingUser(data.roomInfo);
});

// 현재 그려지고 있는 그림 데이터를 넘겨준다.(FROM 첫번째 유저)
socket.on('getImageURL', function(data){
    const img = canvas.toDataURL();
    const id = data.id;
    socket.emit("imgdata", {img:img,id:id});
});

// 새로운 유저가 최근 그림을 받는다
socket.on('canvasSync', function(data){
    const imageTemplete = new Image(); // 기존에 그려지고 있는 그림을 담을 이미지
    imageTemplete.src = data;
    imageTemplete.onload = function(){
        ctx.drawImage(imageTemplete, 0, 0);
    }
});

// 첫 접속시 그리고 있는 유저 표시 함수
function setDrawingUser(roomInfo){
    drawingUser.innerText = roomInfo.drawUser;
}

// 타인 그리기 적용준비
socket.on('other_getReadyDraw', function(data){
    const x = data.x;
    const y = data.y;
    ctx.beginPath();
    ctx.moveTo(x,y);
});

// 타인 그리기 적용
socket.on('other_getDraw', function(data){
    const x = data.x;
    const y = data.y;
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.penWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.strokeStyle = changedColor;
    ctx.lineWidth = penWidth.value;
});

// 타인의 캔버스 클린
socket.on('other_doCanvasClean', function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 타인의 fill
socket.on("other_doUserFill", function(data){
    ctx.fillStyle = data.color;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = changedColor;
});

// 그리기 턴 신청 결과
socket.on("responseTurn", function(data){
    if(data.id == socket.id){
        // 내 턴
        isMyturn = true;
        turnSet.innerText = TEXT_OTHERTURN;
        turnSet.style.backgroundColor = '#FF9500';
        drawingUser.innerText = "my turn!";
        drawingUser.backgroundColor = "lightgreen";
        ctx.beginPath();
    }
    else{
        // 다른 사람 턴
        isMyturn = false;
        paintOn = false;
        turnSet.innerText = TEXT_MYTURN;
        turnSet.style.backgroundColor = 'lightgreen';
        drawingUser.innerText = `${data.name}s turn!`;
        drawingUser.backgroundColor = "lightgray";
    }
});

// 그리기 턴 신청 결과 : 거절
socket.on("nagativeTurnRequire", function(){
    alert("현재 그리기가 진행중입니다.");
});

// 턴 종료 신청 결과
socket.on("responseTurnEnd", function(data){

    if(data.id == socket.id){
        // 내 결과
        isMyturn = false;
        paintOn = false;
    }
    else{
        // 다른 사람의 결과
    }
    turnSet.innerText = TEXT_MYTURN;
    turnSet.style.backgroundColor = 'lightgreen';
    drawingUser.innerText = "wait..";
    drawingUser.backgroundColor = "white";
    ctx.beginPath();
});