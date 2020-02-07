window.addEventListener("DOMContentLoaded", function(){

    bgImageInit();
    
});

// 배경 이미지 셋팅 함수
function bgImageInit(){

    const image = document.createElement("img"); // 배경 사진 객체
    const currentImage = localStorage.getItem("backgroundImg"); // 배경이미지정보가 저장된 로컬스토리지
    const bgInfo = document.getElementById("bgInit"); // 배경 사진 정보 input(hidden)

    let bgSrc; // 배경사진 src를 담을 변수

    if((currentImage) && (currentImage.length != 0)){
        // 로컬스토리지에 이미지 정보가 있을 때
        // 1. 해당 이미지 정보를 배경이미지로 저장한다.
        // 2. bg input태그에 배경이미지 번호를 저장한다.
        bgSrc = currentImage;
        bgInfo.value = currentImage;
    }
    else{
        // 로컬스토리지에 이미지 정보가 없을 때
        // 1. bg input태그의 value값으로 배경이미지를 지정한다.
        // 2. 로컬스토리지에 이미지 정보를 저장한다.
        bgSrc = bgInfo.value;
        localStorage.setItem("backgroundImg", bgInfo.value);
    }
    bgimageSet(image, bgSrc);
}

// 이미지 추가함수
function bgimageSet(image, src){
    image.src = `../bgImages/${src}.jpg`;
    image.classList.add("bgImage");
    image.onload = function(){
        document.querySelector("body").appendChild(image);
    }
}