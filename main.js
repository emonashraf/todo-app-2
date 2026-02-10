const todoList = JSON.parse(localStorage.getItem('todoList')) ?? [];
let editingTodo = null;
let successMessage = '';

const todoForm = document.getElementById('todoForm');
const todoListElement = document.querySelector('#todoList');
const completedListElement = document.querySelector('#completedList');

init();


const handleFormSubmit = function (e) {
  e.preventDefault();
  clearErrors();

  const { data, isValid, errors } = validateFormData(todoForm, {
    title: ['required', 'string'],
    priority: ['required', 'string'],
  });

  if (!isValid) {
    displayErrors(errors, todoForm);
    return;
  }

  editingTodo ? updateTodo(data) : addTodo(data);

  formReset();
  updateStorageAndDisplayTodo();
  displaySuccessMessage();
}

todoForm.addEventListener('submit', handleFormSubmit);

/**
 * Adds a new todo to the list.
 * @param {Object} data - An object containing the new todo's data.
 * @property {string} data.title - The title of the new todo.
 * @property {string} data.priority - The priority of the new todo.
 * @returns {undefined}
 */
function addTodo(data) {
  let now = Date.now();
  let newTodo = {
    id: now,
    title: data.title,
    priority: data.priority,
    completed: false,
    created_at: now,
    updated_at: now,
  };
  todoList.push(newTodo);
  successMessage = 'New todo added successfully';
}

/**
 * Updates an existing todo in the list.
 * @param {Object} data - An object containing the updated todo's data.
 * @property {string} data.title - The title of the updated todo.
 * @property {string} data.priority - The priority of the updated todo.
 * @returns {undefined}
 */
function updateTodo(data) {
  editingTodo.title = data.title;
  editingTodo.priority = data.priority;
  editingTodo.updated_at = Date.now();
  successMessage = 'Todo updated successfully';
}

/**
 * Undoes a completed todo.
 * @param {number} id - The ID of the todo to incomplete.
 * @returns {undefined}
 */
function undoneTodo(id) {
  let todo = findTodoById(id);
  todo.completed = false;
  updateStorageAndDisplayTodo();
  displayCompleted();
  todoForm.reset();
  editingTodo = null;
  successMessage = 'Todo moved to todo list successfully';
}

/**
 * Marks a todo as completed.
 * @param {number} id - The ID of the todo to complete.
 * @returns {undefined}
 * @description
 * This function marks a todo as completed by setting the completed property to true.
 * It then updates the local storage and displays the updated list of todos and completed todos.
 * It also resets the todo form and sets the editingTodo to null.
 * Finally, it sets a success message to be displayed.
 */
function completeTodo(id) {
  let todo = findTodoById(id);
  todo.completed = true;
  updateStorageAndDisplayTodo();
  displayCompleted();
  todoForm.reset();
  editingTodo = null;
  successMessage = 'Todo moved to completed successfully';
}

/**
 * Displays the completed todos in the UI.
 * @description
 * This function filters the completed todos from the todoList and displays them in the UI.
 * It uses the display function to render the completed todos in the completedListElement.
 */
function displayCompleted() {
  const todos = todoList.filter((todo) => todo.completed);
  display(todos, completedListElement);
}

/**
 * Displays the uncompleted todos in the UI.
 * @description
 * This function filters the uncompleted todos from the todoList and displays them in the UI.
 * It uses the display function to render the uncompleted todos in the todoListElement.
 */
function displayTodo() {
  const todos = todoList.filter((todo) => !todo.completed);
  display(todos, todoListElement);
}

/**
 * Displays a list of todos in the UI.
 * @param {Array} todos - The list of todos to be displayed.
 * @param {HTMLElement} element - The HTML element to display the todos in.
 * @description
 * This function takes a list of todos and an HTML element, and displays the todos in the element.
 * It uses the todoListItemComponent and todoListComponent to render the todos in the element.
 * If the list of todos is empty, it displays an empty list component instead.
 */
function display(todos, element) {
  let list = '';
  if (todos.length === 0) {
    list = emptyListComponent();
  }
  todos.forEach(function (todo) {
    list += todoListItemComponent(todo);
  });

  element.innerHTML = todoListComponent(list);
}

/**
 * Finds a todo in the todoList by its ID.
 * @param {number} id - The ID of the todo to find.
 * @returns {Object|null} The found todo, or null if no todo is found.
 * @description
 * This function takes an ID and returns the todo with that ID from the todoList.
 * If no todo is found with the given ID, it returns null.
 */
function findTodoById(id) {
  return todoList.find((todo) => todo.id === id);
}

/**
 * Finds the index of a todo in the todoList by its ID.
 * @param {number} id - The ID of the todo to find.
 * @returns {number} The index of the found todo, or -1 if no todo is found.
 * @description
 * This function takes an ID and returns the index of the todo with that ID from the todoList.
 * If no todo is found with the given ID, it returns -1.
 */
function findIndexOfTodoById(id) {
  return todoList.findIndex((todo) => todo.id === id);
}

/**
 * Updates the todo form with the given todo's data.
 * @param {number} todoId - The ID of the todo to update the form with.
 * @description
 * This function takes a todo ID and updates the todo form with the corresponding todo's data.
 * It uses the findTodoById function to find the todo with the given ID, and then sets the form's title and priority fields to the todo's title and priority.
 */
function updateFormData(todoId) {
  editingTodo = findTodoById(todoId);
  todoForm.title.value = editingTodo.title;
  todoForm.priority.value = editingTodo.priority;
}

/**
 * Deletes a todo from the todoList by its ID.
 * @param {number} id - The ID of the todo to delete.
 * @description
 * This function takes an ID and deletes the todo with that ID from the todoList.
 * If the todo is found and deleted successfully, it updates the local storage and displays the updated list of todos.
 * It also sets a success message to be displayed.
 */
function deleteTodo(id) {
  let index = findIndexOfTodoById(id);

  if (index > -1) {
    todoList.splice(index, 1);
    updateStorageAndDisplayTodo();
    successMessage = 'Todo deleted successfully';
  }
}

/**
 * Returns a function based on the given key.
 * @param {string} key - The key of the action to return.
 * @returns {function|null} The action function, or null if no action is found.
 * @description
 * This function takes a key and returns a function based on the key.
 * The key can be one of 'edit', 'delete', 'done', or 'undone', and it will return the corresponding action function.
 * If no action is found with the given key, it returns null.
 */
function getAction(key) {
  const actions = {
    edit: updateFormData,
    delete: deleteTodo,
    done: completeTodo,
    undone: undoneTodo,
  };
  return actions[key];
}

/**
 * Handles button clicks in the todo list and completed list.
 * @param {Event} e - The event object of the button click.
 * @description
 * This function takes an event object, extracts the action type and todo ID from the event target's dataset, and calls the corresponding action function with the todo ID.
 * If the action type is not 'edit', it displays a success message.
 */
function handleButtonClicks(e) {
  e.stopPropagation();
  const actionType = e.target.dataset.action;
  
  if (!actionType) {
    return;
  }

  const action = getAction(actionType);

  let todoId = Number(e.target.dataset.id);
  action(todoId);
  
  if (actionType !== 'edit') {
    displaySuccessMessage();
  }

  if(actionType === 'done' || actionType === 'undone') {
    displayCompleted();
  }

}

/**
 * Updates the local storage with the current todoList.
 * @description
 * This function takes the current todoList and updates the local storage with it.
 * It uses the JSON.stringify method to convert the todoList to a JSON string, and then uses the localStorage.setItem method to update the local storage.
 */
function updateLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

/**
 * Initializes the application by displaying the list of todos and completed todos, and adding event listeners to the todo list and completed list elements.
 * @description
 * This function is called when the application is initialized, and it sets up the event listeners for the todo list and completed list elements.
 * It also displays the list of todos and completed todos by calling the displayTodo and displayCompleted functions.
 */
function init() {
  displayTodo();
  displayCompleted();

  todoListElement.addEventListener('click', (e) => handleButtonClicks(e));
  completedListElement.addEventListener('click', (e) => handleButtonClicks(e));
}

/**
 * Displays a success message in the UI.
 * @description
 * This function takes the successMessage variable and displays it in the UI as a success alert.
 * It uses the successAlert function to generate the alert component, and then inserts it into the UI using the insertAdjacentHTML method.
 * It also removes the alert component after 1000 milliseconds using the setTimeout function.
 */
function displaySuccessMessage() {
  const alertComponent = successAlert(successMessage);
  document
    .getElementById('app')
    .insertAdjacentHTML('afterbegin', alertComponent);
  setTimeout(() => {
    document.querySelector('.alert').remove();
  }, 1000);
}

/**
 * Resets the todo form and sets the editingTodo variable to null.
 * @description
 * This function is called when the user submits the todo form, or when the user clicks the cancel button.
 * It resets the todo form by calling the reset method, and then sets the editingTodo variable to null.
 */
function formReset() {
  todoForm.reset();
  editingTodo = null;
}

/**
 * Clears all form errors from the todo form.
 * @description
 * This function is used to clear all form errors from the todo form.
 * It uses the querySelectorAll method to select all elements with the class 'form-error', and then uses the forEach method to remove each element.
 */
function clearErrors() {
  todoForm.querySelectorAll('.form-error').forEach((item) => item.remove());
}

/**
 * Updates the local storage with the current todoList, and then displays the list of todos in the UI.
 * @description
 * This function is called when the user submits the todo form, or when the user clicks the cancel button.
 * It updates the local storage with the current todoList by calling the updateLocalStorage function, and then displays the list of todos in the UI by calling the displayTodo function.
 */
function updateStorageAndDisplayTodo() {
  updateLocalStorage();
  displayTodo();
}
