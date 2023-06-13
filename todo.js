const todoContainer = document.getElementById('todos');
let todosData = null; // Store the fetched todos data

const getTodos = () => {
  return fetch('https://dummyjson.com/users/5/todos')
    .then(response => response.json())
    .then(response => {
      todosData = response; // Save the fetched todos data
      return response;
    })
    .catch(error => error);
}

const toggleCompleted = (item) => {
  item.completed = !item.completed; // Toggle the 'completed' property
  const div = document.querySelector(`div[key="${item.id}"]`);
  const completed = div.querySelector('.todo-completed'); // Update the class name here
  completed.textContent = `Completed: ${item.completed}`;
}

const deleteTask = (taskId) => {
  const div = document.querySelector(`div[key="${taskId}"]`);
  const taskIndex = todosData.todos.findIndex(item => item.id === taskId);
  if (taskIndex !== -1) {
    const deletedTask = todosData.todos.splice(taskIndex, 1)[0];
    div.remove();
    console.log('Task Deleted:', deletedTask);
  } else {
    console.log('Task not found');
  }
}

const addTask = (userId, task) => {
  const div = document.createElement('div');
  const id = document.createElement('id');
  const todo = document.createElement('h2');
  const userIdElement = document.createElement('p');
  const completed = document.createElement('p');
  const deleteButton = document.createElement('span');

  const newTask = {
    userId: userId,
    id: Math.floor(Math.random() * 1000) + 100, // Generate a random ID for the new task
    todo: task,
    completed: false
  };

  id.innerHTML = newTask.id;
  todo.innerHTML = newTask.todo;
  userIdElement.innerHTML = newTask.userId;
  completed.innerHTML = `Completed: ${newTask.completed}`;
  completed.classList.add('todo-completed'); // Update the class name here

  deleteButton.innerHTML = 'Delete';
  deleteButton.classList.add('delete-button'); // Add class for styling
  deleteButton.addEventListener('click', () => deleteTask(newTask.id));

  div.appendChild(id);
  div.appendChild(todo);
  div.appendChild(completed);
  div.appendChild(userIdElement);
  div.appendChild(deleteButton);
  div.setAttribute('key', newTask.id);
  div.setAttribute('class', 'todo');

  todoContainer.appendChild(div);
  console.log('New Task Added:', newTask);
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

    id.innerHTML = item.id;
    todo.innerHTML = item.todo;
    userId.innerHTML = item.userId;
    completed.innerHTML = `Completed: ${item.completed}`;
    completed.classList.add('todo-completed'); // Update the class name here

    deleteButton.innerHTML = 'Delete';
    deleteButton.classList.add('delete-button'); // Add class for styling
    deleteButton.addEventListener('click', () => deleteTask(item.id));

    div.appendChild(id);
    div.appendChild(todo);
    div.appendChild(completed);
    div.appendChild(userId);
    div.appendChild(deleteButton);
    div.setAttribute('key', item.id);
    div.setAttribute('class', 'todo');

    todoContainer.appendChild(div);

    div.addEventListener('click', () => toggleCompleted(item)); // Add event listener to toggle completion
  });
}

const addTaskBtn = document.getElementById('addTaskBtn');
const newTaskInput = document.getElementById('newTaskInput');

addTaskBtn.addEventListener('click', () => {
  const task = newTaskInput.value;
  const userId = 1; // Replace with the desired user ID
  addTask(userId, task);
  newTaskInput.value = ''; // Clear the input field
});

displayTodos();
