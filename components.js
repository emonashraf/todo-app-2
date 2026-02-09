function todoListComponent(children) {
  return `<table class="table table-striped">
    <thead>
      <tr>
        <th>Title</th> 
        <th>Priority</th>
        <th>Created At</th>
        <th>Updated At</th>
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
              <td>${formatDate(todo.created_at)}</td>
              <td>${formatDate(todo.updated_at)}</td>
              <td class="d-flex flex-wrap gap-2 justify-content-end">${buttonComponents(todo)}</td>
          </tr>`
}


function icons (name, size=12) {
  let icons = {
    edit: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    done: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>`,
    undone: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo2-icon lucide-undo-2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>`,
  };

  return icons[name] ?? '';
}

function buttonComponent(todoId, actionType, style, label) {
  return `<button class="btn btn-sm btn-${style}" data-action="${actionType}" data-id="${todoId}"> ${icons(actionType)} ${label}</button>`;
}


function buttonComponents(todo) {
  let content = ``;
  if (!todo.completed) {
    content += buttonComponent(todo.id, 'done', 'success', 'Done');
    content += buttonComponent(todo.id, 'edit', 'primary', 'Edit');
  } else {
    content += buttonComponent(todo.id, 'undone', 'warning', 'Undone');
  }
  content += buttonComponent(todo.id, 'delete', 'danger', 'Delete');

  return content;
}

function successAlert(message) {
  return `
   <div class="alert alert-success d-flex align-items-center" role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-circle-check-icon lucide-circle-check">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
      </svg>
      <div class="ms-2">
          ${message}
      </div>
  </div>`;
}

function emptyListComponent() {
  return `<tr><td colspan="5" class="text-center">No todos found</td></tr>`
}