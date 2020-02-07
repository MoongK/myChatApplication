window.addEventListener("DOMContentLoaded", function(){

    localStorage.removeItem("backgroundImg"); // 저장되어있는 backgroundImg를 삭제한다.

    const nameValue = document.getElementById("joinValue");
    const joinBtn = document.getElementById("joinBtn");

    joinBtn.addEventListener("click", function(event){
        if(nameValue.value == ""){
            alert("이름을 입력하세요.");
            nameValue.focus();
            event.preventDefault();
        }
    });

    const IMG_NUMBER = document.querySelector("#fileCount").value;
    initBG(document.querySelector("body"), IMG_NUMBER);

    getTime();
    setInterval(getTime, 1000);
});


function paintImage(imgNumber, body){
    const image = new Image();
    image.src = `./bgImages/${imgNumber}.jpg`;

    body.appendChild(image);
    image.classList.add("bgImage");
}


function initBG(body, IMG_NUMBER){
    paintImage(IMG_NUMBER, body);
}


function getTime(){
    const date = new Date();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const mainClock = document.querySelector("h1");
    mainClock.innerHTML = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
