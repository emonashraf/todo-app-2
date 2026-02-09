/*  
  Programming principles
  DRY = Don't Repeat Yourself
  KISS = Keep It Simple Stupid
  SOLID
  S = Single Responsibilites
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

function displayCompleted() {
  const todos = todoList.filter((todo) => todo.completed)
  display(todos, completedListElement);
}

function displayTodo() {
  const todos = todoList.filter((todo) => !todo.completed)
  display(todos, todoListElement);
}

function display(todos, element) {
  let list = '';
  todos.forEach(function (todo) {
    list += todoListItemComponent(todo)
  });
  element.innerHTML = todoListComponent(list);
}

function handleButtonClicks(e) {
  let dataId = Number(e.target.dataset.id);
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
  if (e.target.classList.contains('doneBtn')) {
    let todo = todoList.find((todo) => todo.id === dataId);
    todo.completed = true;
    localStorage.setItem('todoList', JSON.stringify(todoList));
    displayTodo();
    displayCompleted();
  }
}

todoListElement.addEventListener('click', () => handleButtonClicks(e));

completedListElement.addEventListener('click', function (e) {
  let dataId = Number(e.target.dataset.id);

  if (e.target.classList.contains('undoneBtn')) {
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