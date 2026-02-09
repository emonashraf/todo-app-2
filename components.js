function todoListComponent(children) {
  return `<table class="table table-striped">
    <thead>
      <tr>
        <th>To-Do</th> 
        <th>Priority</th>
        <th class="text-end">Action</th>
      </tr>
    </thead>
    <tbody>
      ${children}
    </tbody>
  </table>`
}

function todoListItemComponent(todo) {
  return `<tr>
              <td>${todo.title}</td>
              <td>${todo.priority}</td>
              <td class="d-flex flex-wrap gap-2 justify-content-end">${buttonComponents(todo)}</td>
          </tr>`
}


function buttonComponent(todoId, classes, label) {
  return `<button class="btn ${classes}" data-id="${todoId}">${label}</button>`;
}


function buttonComponents(todo) {
  let content = ``;
  if (todo.completed) {
    content += buttonComponent(todo.id, 'btn-success doneBtn', 'Done');
  } else {
    content += buttonComponent(todo.id, 'btn-warning undoneBtn', 'Undone');
    content += buttonComponent(todo.id, 'btn-primary editBtn', 'Edit');
  }
  content += buttonComponent(todo.id, 'btn-danger deleteBtn', 'Delete');

  return content;
}