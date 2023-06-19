const todoContainer = document.getElementById('todos');
const getTodos = () => {
  return fetch('https://dummyjson.com/todos')
    .then(response => response.json())
    .then(response => {
      todosData = response; 
      return response;
    })
    .catch(error => error);
}

const toggleCompleted = async (item) => {
  item.completed = !item.completed; 
  const div = document.querySelector(`div[key="${item.id}"]`);
  const completed = div.querySelector('.todo-completed'); 
  completed.textContent = `Completed: ${item.completed}`;

  try {
    const response = await fetch(`https://dummyjson.com/todos/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });

    if (response.ok) {
      console.log('Task updated:', item);
    } else {
      console.log('Failed to update task:', response.status);
    }
  } catch (error) {
    console.log('Error occurred while updating task:', error);
  }
}

const deleteTask = (taskElement) => {
  const taskId = taskElement.getAttribute('key');
  taskElement.remove();
  console.log('Task Deleted:', taskId);
}

const updateTask = (item) => {
  const div = document.querySelector(`div[key="${item.id}"]`);
  const todo = div.querySelector('h2');
  const updateButton = div.querySelector('.update-button');
  todo.contentEditable = true;
  todo.focus();
  updateButton.disabled = true;

  const saveChanges = () => {
    todo.contentEditable = false;
    updateButton.disabled = false;
    const updatedTask = {
      userId: item.userId,
      id: item.id,
      todo: todo.textContent.trim(),
      completed: item.completed
    };
    Object.assign(item, updatedTask); 
    console.log('Task updated:', item);
  };

  const cancelChanges = () => {
    todo.contentEditable = false;
    updateButton.disabled = false;
    todo.textContent = item.todo;
  };

  todo.addEventListener('input', () => {
    updateButton.disabled = false;
  });

  todo.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveChanges();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelChanges();
    }
  });

  updateButton.addEventListener('click', saveChanges);
}

const addTask = (userId, task) => {
  const div = document.createElement('div');
  const id = document.createElement('id');
  const todo = document.createElement('h2');
  const userIdElement = document.createElement('p');
  const completed = document.createElement('p');
  const deleteButton = document.createElement('span');
  const updateButton = document.createElement('button');

  const newTask = {
    userId: userId,
    id: Math.floor(Math.random() * 1000) + 100, 
    todo: task,
    completed: false
  };

  id.innerHTML = newTask.id;
  todo.innerHTML = newTask.todo;
  userIdElement.innerHTML = newTask.userId;
  completed.innerHTML = `Completed: ${newTask.completed}`;
  completed.classList.add('todo-completed'); 

  deleteButton.innerHTML = 'Delete';
  deleteButton.classList.add('delete-button'); 
  deleteButton.addEventListener('click', () => deleteTask(div));

  updateButton.innerHTML = 'Update'; 
  updateButton.classList.add('update-button'); 
  updateButton.addEventListener('click', () => updateTask(newTask));

  div.appendChild(id);
  div.appendChild(todo);
  div.appendChild(completed);
  div.appendChild(userIdElement);
  div.appendChild(deleteButton);
  div.appendChild(updateButton); 
  div.setAttribute('key', newTask.id);
  div.setAttribute('class', 'todo');

  todoContainer.appendChild(div);
  console.log('New Task Added:', newTask);

  div.addEventListener('click', () => toggleCompleted(newTask)); 
}

const displayTodos = async () => {
  const todos = await getTodos();
  console.log(todos.todos);
  todos.todos.map(item => {
    let div = document.createElement('div');
    let id = document.createElement('id');
    let todo = document.createElement('h2');
    let userId = document.createElement('p');
    let completed = document.createElement('p');
    const deleteButton = document.createElement('span');
    const updateButton = document.createElement('button'); 

    id.innerHTML = item.id;
    todo.innerHTML = item.todo;
    userId.innerHTML = item.userId;
    completed.innerHTML = `Completed: ${item.completed}`;
    completed.classList.add('todo-completed'); 

    deleteButton.innerHTML = 'Delete';
    deleteButton.classList.add('delete-button'); 
    deleteButton.addEventListener('click', () => deleteTask(div));

    updateButton.innerHTML = 'Update'; 
    updateButton.classList.add('update-button'); 
    updateButton.addEventListener('click', () => updateTask(item));

    div.appendChild(id);
    div.appendChild(todo);
    div.appendChild(completed);
    div.appendChild(userId);
    div.appendChild(deleteButton);
    div.appendChild(updateButton); 
    div.setAttribute('key', item.id);
    div.setAttribute('class', 'todo');

    todoContainer.appendChild(div);

    div.addEventListener('click', () => toggleCompleted(item)); 
  });
}

const addTaskBtn = document.getElementById('addTaskBtn');
const newTaskInput = document.getElementById('newTaskInput');

addTaskBtn.addEventListener('click', () => {
  const task = newTaskInput.value;
  const userId = 1; 
  addTask(userId, task);
  newTaskInput.value = ''; 
});

displayTodos();
