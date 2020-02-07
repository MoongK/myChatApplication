const TODO_LIST_NAME = 'TODO_LIST'; // localStorage에 세팅할 todoList 제목
let todoList; // li를 추가할 todoList(ul)
let todoBtn; // todoList 추가 버튼
let todoValue; // todoList에 추가될 값
let todoItems = new Array(); // todoList 목록
let todoCount = 0; // 저장된 todoList 숫자

// 추가 버튼 => 목록에 저장 => 목록을 localStorage에 저장

window.addEventListener("DOMContentLoaded", function(){
    todoList = document.querySelector("#todoList");
    todoBtn =  document.getElementById("todoBtn");
    todoValue = document.getElementById('todoValue');

    /**************** todoList관련 ****************/
    todoBtn.addEventListener("click", function(event){ // todoList 추가 이벤트
        pushItem(todoValue.value);
    });

    todoValue.addEventListener("keypress", function(event){
        if(event.keyCode == 13){
            todoBtn.click();
        }
    });

    todoInit();
});

function todoInit(){
    const savedItems = JSON.parse(localStorage.getItem(TODO_LIST_NAME));

    if(savedItems){
        if(savedItems.length != 0){
            for(var i=0;i<savedItems.length;i++){
                pushItem(savedItems[i].text);
            }
            setTodoItems(todoItems);
        }
        todoCount = savedItems.length;
    }
}

function pushItem(item){

    const li = document.createElement("li");
    li.id = `todo${todoCount++}`;
    const delBtn = document.createElement("button");
    const span = document.createElement("span");
    
    delBtn.innerHTML = "❌";
    delBtn.addEventListener("click", deleteItem);
    span.innerText = item;

    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
    
    const todoObj = {
        id:li.id,
        text:item
    }

    todoItems.push(todoObj);
    setTodoItems(todoItems);
}

function deleteItem(event){

    const btn = event.target;
    const li = btn.parentNode;
    const span = li.querySelector("span");
/*     const text = span.innerText;
    const id = li.id; */
    todoList.removeChild(li);

    todoItems = todoItems.filter(item => item.id != li.id);
    setTodoItems(todoItems);
}

function setTodoItems(todoItems){
    localStorage.setItem(TODO_LIST_NAME, JSON.stringify(todoItems));
    todoValue.value = '';
}