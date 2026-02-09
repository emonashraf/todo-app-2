/*
Add todo
    handle form submit 
    a) form data dhore ekta new todo object banate hobe
    b) todo item take todo list a push korbo
    c) todoList local storage a save korte hobe
    d) todoList render korte hobe
  
    edit todolist 
    a) edit btn er moddhe event listener add kobo(click event)
    b) editing todo ta todoList theke ber kore nibo
    c) todo data diye form update korobo
    d) update functionalities 
    e) editing todo ta update korte hobe form data diye
    f) localstorage update korte hobe
    g) todoList abr render korte hobe

*/


const todoList = JSON.parse(localStorage.getItem('todoList')) ?? [];
let editingTodo = null;

const todoForm = document.querySelector('#todoForm');

const todoListElement = document.querySelector('#todoList');
const completedListElement = document.querySelector('#completedList');



todoForm.addEventListener('submit', function (e) {
  e.preventDefault();

  let title = todoForm.title.value?.trim();
  let priority = todoForm.priority.value?.trim();

  // form data validation
  if (!title) {
    alert('Title is required');
    return;
  }
  if (!priority) {
    alert('Priority must need to be selected');
    return;
  }

  if (!editingTodo) {
    let newTodo = {
      id: Date.now(),
      title: title,
      priority: priority,
      completed: false
    }
    todoList.push(newTodo);
  } else {
    editingTodo.title = title;
    editingTodo.priority = priority;
  }

  todoForm.reset();
  editingTodo = null;

  localStorage.setItem('todoList', JSON.stringify(todoList));

  displayTodo();
});


function displayTodo() {
  let list = `<ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <h5>To-Do</h5> 
                    <h5>Priority</h5>
                    <h5>Action</h5>
                </li>`;
  todoList.forEach(function (todo) {
    if (!todo.completed) {
      list += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <h6>${todo.title}</h6>
                    <h6>${todo.priority}</h6>
                    <div class="d-flex flex-wrap gap-2">
                        <button class="btn btn-success completeBtn" data-id="${todo.id}">Done</button>
                        <button class="btn btn-primary editBtn" data-id="${todo.id}">Edit</button>
                        <button class="btn btn-danger deleteBtn" data-id="${todo.id}">Delete</button>
                    </div>
                </li>`
    }
  });

  list += '</ul>';

  todoListElement.innerHTML = list;

}

function displayCompleted() {
  let list = `<ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <h5>To-Do</h5> 
                    <h5>Priority</h5>
                    <h5>Action</h5>
                </li>`;
  todoList.forEach(function (todo) {
    if (todo.completed) {
      list += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <h6>${todo.title}</h6>
                    <h6>${todo.priority}</h6>
                    <div class="d-flex flex-wrap gap-2">
                        <button class="btn btn-success incompleteBtn" data-id="${todo.id}">Undone</button>
                        <button class="btn btn-danger deleteBtn" data-id="${todo.id}">Delete</button>
                    </div>
                </li>`
    }
  });

  list += '</ul>';

  completedListElement.innerHTML = list;
}


todoListElement.addEventListener('click', function (e) {
  let dataId = Number(e.target.dataset.id); // ekhane Number() function use kora hoyeche id take number bananor jonno
  if (e.target.classList.contains('editBtn')) {
    editingTodo = todoList.find((todo) => todo.id === dataId);
    todoForm.title.value = editingTodo.title;
    todoForm.priority.value = editingTodo.priority;
  }

  if (e.target.classList.contains('deleteBtn')) {
    let index = todoList.findIndex((todo) => todo.id === dataId);

    if (index > -1) {
      todoList.splice(index, 1);
      localStorage.setItem('todoList', JSON.stringify(todoList));
      displayTodo();
    }
  }
  if (e.target.classList.contains('completeBtn')) {
    let todo = todoList.find((todo) => todo.id === dataId);
    todo.completed = true;
    localStorage.setItem('todoList', JSON.stringify(todoList));
    displayTodo();
    displayCompleted();
  }
});

completedListElement.addEventListener('click', function (e) {
  let dataId = Number(e.target.dataset.id);

  if (e.target.classList.contains('incompleteBtn')) {
    console.log('incomplete');

    let todo = todoList.find((todo) => todo.id === dataId);
    todo.completed = false;
    localStorage.setItem('todoList', JSON.stringify(todoList));
    displayTodo();
    displayCompleted();
  }
  if (e.target.classList.contains('deleteBtn')) {
    let index = todoList.findIndex((todo) => todo.id === dataId);

    if (index > -1) {
      todoList.splice(index, 1);
      localStorage.setItem('todoList', JSON.stringify(todoList));
      displayTodo();
      displayCompleted();
    }
  }
});

displayTodo();
displayCompleted();